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
import { Scanner } from "@yudiel/react-qr-scanner"
import { useRouter } from "next/navigation"

interface QrScannerModalProps {
  children: React.ReactNode
}

export function QrScannerModal({ children }: QrScannerModalProps) {
  const router = useRouter()

  const handleScan = (result: string) => {
    console.log("Scanned QR code result:", result)
    if (result) {
      try {
        const url = new URL(result)
        if (url.origin === window.location.origin) {
          router.push(url.pathname)
        }
      } catch (error) {
        console.error("Scanned QR code is not a valid URL:", error)
      }
    }
  }

  const handleError = (error: any) => {
    console.error(error)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription>
            Scan a server invite QR code to join a server.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          <Scanner
            onDecode={handleScan}
            onError={handleError}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
