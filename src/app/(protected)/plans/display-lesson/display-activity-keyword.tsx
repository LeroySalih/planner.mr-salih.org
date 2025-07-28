"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, ChevronUp, ChevronDown, Edit3, Save, X } from "lucide-react"
import { Activity } from "@/actions/activities/types"

interface KeywordDefinition {
  id: string
  keyword: string
  definition: string
}

interface KeywordDefinitionTableProps {
  editing: boolean | null
  activity: Activity
  onEditingEnd?: (data: Activity) => void
}

export default function KeywordDefinitionTable({
  editing,
  activity,
  onEditingEnd,
}: KeywordDefinitionTableProps) {

  if (!Array.isArray(activity?.body?.keywords)) {
      activity.body = activity.body || {};
      activity.body.keywords = [];
  } 

  const [data, setData] = useState<KeywordDefinition[]>(activity.body.keywords)
  const [editingCell, setEditingCell] = useState<{ id: string; field: "keyword" | "definition" } | null>(null)
  const [editValue, setEditValue] = useState("")

  const updateData = (newData: KeywordDefinition[]) => {
    setData(newData)

    
  }

  const handleEdit = (id: string, field: "keyword" | "definition") => {
    const item = data.find((d) => d.id === id)
    if (item) {
      setEditingCell({ id, field })
      setEditValue(item[field])
    }
  }

  const handleSave = () => {
    if (editingCell) {
      const newData = data.map((item) =>
        item.id === editingCell.id ? { ...item, [editingCell.field]: editValue } : item,
      )
      updateData(newData)
      setEditingCell(null)
      setEditValue("")
    }
  }

  const handleCancel = () => {
    setEditingCell(null)
    setEditValue("")
  }

  const handleAdd = () => {
    const newItem: KeywordDefinition = {
      id: Date.now().toString(),
      keyword: "New Keyword",
      definition: "New Definition",
    }
    updateData([...data, newItem])
  }

  const handleDelete = (id: string) => {
    updateData(data.filter((item) => item.id !== id))
  }

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newData = [...data]
      ;[newData[index - 1], newData[index]] = [newData[index], newData[index - 1]]
      updateData(newData)
    }
  }

  const handleMoveDown = (index: number) => {
    if (index < data.length - 1) {
      const newData = [...data]
      ;[newData[index], newData[index + 1]] = [newData[index + 1], newData[index]]
      updateData(newData)
    }
  }

  const renderCell = (item: KeywordDefinition, field: "keyword" | "definition") => {
    const isEditing = editingCell?.id === item.id && editingCell?.field === field

    if (!editing || !isEditing) {
      return (
        <div className="flex items-start gap-1">
          <span className="flex-1 break-words text-sm leading-tight">{item[field]}</span>
          {editing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(item.id, field)}
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <Edit3 className="h-2.5 w-2.5" />
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="h-7 text-sm"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave()
            if (e.key === "Escape") handleCancel()
          }}
        />
        <Button variant="ghost" size="sm" onClick={handleSave} className="h-5 w-5 p-0 flex-shrink-0">
          <Save className="h-2.5 w-2.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCancel} className="h-5 w-5 p-0 flex-shrink-0">
          <X className="h-2.5 w-2.5" />
        </Button>
      </div>
    )
  }

  useEffect(()=>{
    // only update when the user has disabled editing
    if (editing === false) {
        const newActivity = Object.assign({}, activity, {body: {keywords: data}});

        //console.log("updating Activity", newActivity);

        onEditingEnd?.(newActivity)
    }
  },[editing])

  //console.log("Activity:: Keywords", data);
  
  return (
    <div className="w-full space-y-3">
      {editing && (
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold">Edit Keywords</h3>
          <Button onClick={handleAdd} size="sm" className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        {/* Header */}
        <div
          className={`grid ${editing ? "grid-cols-[1fr_2fr_60px]" : "grid-cols-[1fr_2fr]"} gap-2 bg-muted/50 p-2 border-b`}
        >
          <div className="text-xs font-medium">Keyword</div>
          <div className="text-xs font-medium">Definition</div>
          {editing && <div className="text-xs font-medium">Actions</div>}
        </div>

        {/* Rows */}
        <div className="divide-y">
          {data.map((item, index) => (
            <div
              key={item.id}
              className={`grid ${editing ? "grid-cols-[1fr_2fr_60px]" : "grid-cols-[1fr_2fr]"} gap-2 p-2 group hover:bg-muted/30`}
            >
              <div className="font-medium text-sm min-w-0">{renderCell(item, "keyword")}</div>
              <div className="text-sm min-w-0">{renderCell(item, "definition")}</div>
              {editing && (
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="h-5 w-5 p-0"
                    >
                      <ChevronUp className="h-2.5 w-2.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === data.length - 1}
                      className="h-5 w-5 p-0"
                    >
                      <ChevronDown className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="h-5 w-full p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {data.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No keywords defined yet
              {editing && (
                <div className="mt-2">
                  <Button onClick={handleAdd} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Keyword
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
