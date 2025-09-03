"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { type ClassItem, createClass } from "../lib/class-utils"

interface CreateClassDialogProps {
  onClassCreate: (classItem: ClassItem) => void
}

export function CreateClassDialog({ onClassCreate }: CreateClassDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newClassTitle, setNewClassTitle] = useState("")
  
  const handleCreateClass = () => {
    if (!newClassTitle.trim()) {
      
        toast("Error",{
        description: "Please enter a class title"
      });

      return
    }

    const newClass = createClass(newClassTitle.trim())
    onClassCreate(newClass)
    setNewClassTitle("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-title">Class Title</Label>
            <Input
              id="new-title"
              value={newClassTitle}
              onChange={(e) => setNewClassTitle(e.target.value)}
              placeholder="Enter class title"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClass}>Create Class</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
