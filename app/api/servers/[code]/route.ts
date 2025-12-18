import { type NextRequest, NextResponse } from "next/server"
import { servers } from "../route"

type Params = Promise<{ code: string }>

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { code } = await params
  const server = servers.get(code.toUpperCase())

  if (!server) {
    return NextResponse.json({ error: "Server not found" }, { status: 404 })
  }

  return NextResponse.json({
    serverCode: server.serverCode,
    serverName: server.serverName,
  })
}
