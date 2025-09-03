"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import type { ClassItem } from "../lib/class-utils"

interface EditClassDialogProps {
  classItem: ClassItem | null
  onClassEdit: (classItem: ClassItem) => void
  onClose: () => void
}

export function EditClassDialog({ classItem, onClassEdit, onClose }: EditClassDialogProps) {
  const [editTitle, setEditTitle] = useState("")
  //const { toast } = useToast()

  useEffect(() => {
    if (classItem) {
      setEditTitle(classItem.title)
    }
  }, [classItem])

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      
        toast.error( "Error",{
        description: "Please enter a class title"
      });

      return
    }

    const updatedClass: ClassItem = {
      ...classItem!,
      title: editTitle.trim(),
    }

    onClassEdit(updatedClass)
    onClose()
  }

  return (
    <Dialog open={!!classItem} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Class Title</Label>
            <Input
              id="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter class title"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
