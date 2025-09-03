"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit2 } from "lucide-react"
import type { ClassItem } from "../lib/class-utils"

interface ClassCardProps {
  classItem: ClassItem
  onEdit: (classItem: ClassItem) => void
  onDelete: (classId: string) => void
  onJoinCodeClick: (joinCode: string) => void
}

export function ClassCard({ classItem, onEdit, onDelete, onJoinCodeClick }: ClassCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-balance">{classItem.title}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(classItem)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(classItem.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-muted-foreground">Join Code</p>
            <Badge
              variant="secondary"
              className="font-mono cursor-pointer hover:bg-secondary/80 transition-colors"
              onClick={() => onJoinCodeClick(classItem.joinCode)}
            >
              {classItem.joinCode}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Class ID</p>
            <p className="text-xs font-mono text-muted-foreground truncate">{classItem.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
