"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import QRCode from "react-qr-code"

interface QrCodeModalProps {
  children: React.ReactNode
  serverCode: string
}

export function QrCodeModal({ children, serverCode }: QrCodeModalProps) {
  const [origin, setOrigin] = React.useState("")

  React.useEffect(() => {
    if (window.location.origin) {
      setOrigin(window.location.origin)
    }
  }, [])

  const inviteUrl = `${origin}/chat/${serverCode}`

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Link</DialogTitle>
          <DialogDescription>
            Share this link with others to invite them to this server.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <QRCode value={inviteUrl} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
