"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LandingPage() {
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleContinue = () => {
    const trimmedName = displayName.trim()

    if (!trimmedName) {
      setError("Please enter a display name")
      return
    }

    if (trimmedName.length < 2) {
      setError("Display name must be at least 2 characters")
      return
    }

    if (trimmedName.length > 20) {
      setError("Display name must be less than 20 characters")
      return
    }

    localStorage.setItem("usap_display_name", trimmedName)
    router.push("/setup")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleContinue()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight text-balance">USAP</h1>
          <p className="text-muted-foreground text-base">Simple, fast messaging for everyone</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Enter your name"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value)
                setError("")
              }}
              onKeyPress={handleKeyPress}
              autoFocus
              maxLength={20}
              className="h-12 text-base"
            />
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>

          <Button variant="default" onClick={handleContinue} className="w-full h-12 text-base font-medium" size="lg">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
