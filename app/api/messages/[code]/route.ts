import type { NextRequest } from "next/server"
import { randomUUID } from "crypto"

type Message = {
  id: string
  username: string
  message: string
  timestamp: number
}

// In-memory storage for messages per server
const serverMessages = new Map<string, Message[]>()

type Params = Promise<{ code: string }>

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { code } = await params

  if (!serverMessages.has(code)) {
    serverMessages.set(code, [])
  }

  const messages = serverMessages.get(code) || []

  return Response.json({ messages })
}

export async function POST(request: NextRequest, { params }: { params: Params }) {
  const { code } = await params
  const body = await request.json()

  const { username, message } = body

  if (!username || !message) {
    return Response.json({ error: "Missing username or message" }, { status: 400 })
  }

  if (!serverMessages.has(code)) {
    serverMessages.set(code, [])
  }

  const messageObj: Message = {
    id: randomUUID(),
    username,
    message,
    timestamp: Date.now(),
  }

  const messages = serverMessages.get(code)!
  messages.push(messageObj)

  // Keep only last 100 messages per server
  if (messages.length > 100) {
    messages.shift()
  }

  return Response.json({ success: true, message: messageObj })
}
