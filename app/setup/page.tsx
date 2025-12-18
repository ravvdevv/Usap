"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, QrCode } from "lucide-react"
import { QrScannerModal } from "@/components/ui/qr-scanner-modal"

export default function SetupPage() {
  const [displayName, setDisplayName] = useState("")
  const [mode, setMode] = useState<"select" | "create" | "join">("select")
  const [serverName, setServerName] = useState("")
  const [serverCode, setServerCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedName = localStorage.getItem("usap_display_name")
    if (!storedName) {
      router.push("/")
      return
    }
    setDisplayName(storedName)
  }, [router])

  const generateServerCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreateServer = async () => {
    const trimmedName = serverName.trim()

    if (!trimmedName) {
      setError("Please enter a server name")
      return
    }

    setLoading(true)
    setError("")

    try {
      const code = generateServerCode()

      const response = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverName: trimmedName,
          serverCode: code,
          creatorName: displayName,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create server")
      }

      const data = await response.json()

      // Navigate to chat
      router.push(`/chat/${data.serverCode}`)
    } catch (err) {
      setError("Failed to create server. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleJoinServer = async () => {
    const trimmedCode = serverCode.trim().toUpperCase()

    if (!trimmedCode) {
      setError("Please enter a server code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/servers/${trimmedCode}`)

      if (!response.ok) {
        throw new Error("Server not found")
      }

      // Navigate to chat
      router.push(`/chat/${trimmedCode}`)
    } catch (err) {
      setError("Server not found. Please check the code.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (mode === "create") {
        handleCreateServer()
      } else if (mode === "join") {
        handleJoinServer()
      }
    }
  }

  if (!displayName) {
    return null
  }

  if (mode === "select") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {displayName}</h1>
            <p className="text-muted-foreground text-base">Create a new server or join an existing one</p>
          </div>

          <div className="grid gap-4">
            <Card
              className="cursor-pointer hover:bg-accent hover:shadow-md transition-all duration-200 border-2"
              onClick={() => setMode("create")}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl">Create Server</CardTitle>
                    <CardDescription className="text-sm">Start a new chat room</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:bg-accent hover:shadow-md transition-all duration-200 border-2"
              onClick={() => setMode("join")}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl">Join Server</CardTitle>
                    <CardDescription className="text-sm">Enter a server code to join</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (mode === "create") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Create Server</h1>
            <p className="text-muted-foreground text-base">Choose a name for your chat room</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="serverName" className="text-sm font-medium">
                Server Name
              </Label>
              <Input
                id="serverName"
                type="text"
                placeholder="My Chat Room"
                value={serverName}
                onChange={(e) => {
                  setServerName(e.target.value)
                  setError("")
                }}
                onKeyPress={handleKeyPress}
                autoFocus
                maxLength={30}
                className="h-12 text-base"
              />
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setMode("select")}
                className="flex-1 h-12 text-base font-medium"
                disabled={loading}
              >
                Back
              </Button>
              <Button onClick={handleCreateServer} className="flex-1 h-12 text-base font-medium" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Join Server</h1>
          <p className="text-muted-foreground text-base">Enter the server code to join</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="serverCode" className="text-sm font-medium">
              Server Code
            </Label>
            <div className="flex gap-2">
            <Input
              id="serverCode"
              type="text"
              placeholder="ABC123"
              value={serverCode}
              onChange={(e) => {
                setServerCode(e.target.value.toUpperCase())
                setError("")
              }}
              onKeyPress={handleKeyPress}
              autoFocus
              maxLength={6}
              className="h-12 text-base font-mono tracking-wider flex-1"
            />
            <QrScannerModal>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <QrCode className="h-6 w-6" />
              </Button>
            </QrScannerModal>
            </div>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setMode("select")}
              className="flex-1 h-12 text-base font-medium"
              disabled={loading}
            >
              Back
            </Button>
            <Button onClick={handleJoinServer} className="flex-1 h-12 text-base font-medium" disabled={loading}>
              {loading ? "Joining..." : "Join"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
