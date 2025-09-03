"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface JoinCodeModalProps {
  joinCode: string | null
  onClose: () => void
}

export function JoinCodeModal({ joinCode, onClose }: JoinCodeModalProps) {
  if (!joinCode) return null

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center" onClick={onClose}>
      <div className="text-center space-y-8">
        <Button variant="ghost" size="sm" className="absolute top-4 right-4" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-muted-foreground">Join Code</h2>
          <div className="text-8xl md:text-9xl font-mono font-bold tracking-wider">{joinCode}</div>
          <p className="text-lg text-muted-foreground">Students can use this code to join the class</p>
        </div>
      </div>
    </div>
  )
}
