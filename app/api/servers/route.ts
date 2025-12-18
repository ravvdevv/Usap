import { type NextRequest, NextResponse } from "next/server"

export const servers = new Map<
  string,
  {
    serverCode: string
    serverName: string
    creatorName: string
    createdAt: number
  }
>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serverName, serverCode, creatorName } = body

    if (!serverName || !serverCode || !creatorName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const normalizedCode = serverCode.toUpperCase()

    // Check if server code already exists
    if (servers.has(normalizedCode)) {
      return NextResponse.json({ error: "Server code already exists" }, { status: 409 })
    }

    // Store server
    servers.set(normalizedCode, {
      serverCode: normalizedCode,
      serverName,
      creatorName,
      createdAt: Date.now(),
    })

    return NextResponse.json({
      serverCode: normalizedCode,
      serverName,
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
