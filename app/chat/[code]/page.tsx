"use client"

import type React from "react"

import { useEffect, useState, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Copy, Check } from "lucide-react"

type Message = {
  id: string
  username: string
  message: string
  timestamp: number
}

type Params = Promise<{ code: string }>

const errorMessages = [
  "Server's gone. Not responding. Just like your last text.",
  "The server failed to exist correctly. We're impressed too.",
  "The server is up. You're just not allowed to see it right now.",
  "Server disappeared. Physics remains undefeated.",
  "Server crashed. Again. Maybe stop clicking.",
  "Server unreachable. But sure, refresh one more time.",
  "There is no server. There never was."
]

const getRandomError = () => errorMessages[Math.floor(Math.random() * errorMessages.length)]

export default function ChatPage({ params }: { params: Params }) {
  const resolvedParams = use(params)
  const [code, setCode] = useState<string>("")
  const [displayName, setDisplayName] = useState("")
  const [serverName, setServerName] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setCode(resolvedParams.code)
  }, [resolvedParams.code])

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!code) return

    // Check if user has a display name
    const storedName = localStorage.getItem("usap_display_name")
    if (!storedName) {
      router.push("/")
      return
    }
    setDisplayName(storedName)

    // Fetch server details
    const fetchServer = async () => {
      try {
        const response = await fetch(`/api/servers/${code}`)
        if (!response.ok) {
          throw new Error("Server not found")
        }
        const data = await response.json()
        setServerName(data.serverName)
        setConnected(true)
      } catch (err) {
        setError(getRandomError())
        setConnected(false)
        // Redirect back to setup if server doesn't exist
        setTimeout(() => {
          router.push("/setup")
        }, 1000)
      }
    }

    fetchServer()
  }, [code, router])

  useEffect(() => {
    if (!displayName || !connected || !code) return

    // Fetch messages initially
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${code}`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages)
        }
      } catch (err) {
        console.log("[v0] Failed to fetch messages:", err)
      }
    }

    fetchMessages()

    // Poll for new messages every second
    pollingIntervalRef.current = setInterval(fetchMessages, 1000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [code, displayName, connected])

  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim()

    if (!trimmedMessage || !connected || !code) {
      return
    }

    try {
      const response = await fetch(`/api/messages/${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: displayName,
          message: trimmedMessage,
        }),
      })

      if (response.ok) {
        setNewMessage("")
        // Immediately fetch latest messages for instant feedback
        const messagesResponse = await fetch(`/api/messages/${code}`)
        if (messagesResponse.ok) {
          const data = await messagesResponse.json()
          setMessages(data.messages)
        }
      }
    } catch (err) {
      console.log("[v0] Failed to send message:", err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLeave = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }
    router.push("/setup")
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  if (!displayName || !serverName || !code) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">{error || "Loading..."}</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleLeave} className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-lg leading-none">{serverName}</h1>
              <p className="text-xs text-muted-foreground mt-1.5 font-mono">{code}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopyCode} className="h-9 gap-2 bg-transparent">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
      </div>

      {/* Connection status */}
      {!connected && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2.5 text-center text-sm text-destructive font-medium">
          {error || "Connecting..."}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-muted/20">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground text-sm">No messages yet</p>
              <p className="text-muted-foreground text-xs">Start the conversation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto">
            {messages.map((msg) => {
              const isOwnMessage = msg.username === displayName
              return (
                <div key={msg.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      isOwnMessage ? "bg-primary text-primary-foreground" : "bg-card border border-border"
                    }`}
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <p
                        className={`text-xs font-semibold ${isOwnMessage ? "text-primary-foreground/90" : "text-foreground"}`}
                      >
                        {msg.username}
                      </p>
                      <p
                        className={`text-[10px] ${isOwnMessage ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                      >
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t bg-card shadow-lg px-4 py-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!connected}
            className="flex-1 h-12 text-base rounded-full px-5"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!connected || !newMessage.trim()}
            size="icon"
            className="h-12 w-12 rounded-full shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
