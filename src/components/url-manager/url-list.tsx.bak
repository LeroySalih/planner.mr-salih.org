"use client"

import type React from "react"
import { act, useEffect, useState } from "react"
import Image from "next/image"
import { X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { UrlObject } from "."
import { Activity } from "@/actions/activities/types"

interface UrlListProps {
  activity: Activity,
  onRemoveUrl: (id: number) => void
  onReorderUrls: (newUrls: UrlObject[]) => void
}

export default function UrlList({ activity, onRemoveUrl, onReorderUrls }: UrlListProps) {
  
  const DOWNLOAD_PATH = `/api/activity/${activity.activity_id}`;

  const imageToUrl = (image: string) => {
    return `${DOWNLOAD_PATH}/${image}`;
  }

  const imagesTpoUrls = (activity: Activity) => {
    console.log("imagesTpoUrls::", activity.body?.images);
    return activity.body?.images.map((image: UrlObject, index: number) => ({
      id: index,
      original: imageToUrl(image.original),
      thumbnail: imageToUrl(image.thumbnail),
    })) || [];
  }

  const [urls, setUrls] = useState<UrlObject[]>(activity.body?.images || []);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(()=>{
    setUrls(imagesTpoUrls(activity));
  },[]);

  useEffect(()=>{

    if (!activity || !activity.body?.images) {
      setUrls([]);
      return;
    }

    setUrls(activity.body?.images || []);

  },[activity])

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newUrls = [...urls]
    const draggedItem = newUrls[draggedIndex]

    // Remove the dragged item
    newUrls.splice(draggedIndex, 1)

    // Insert at new position
    newUrls.splice(dropIndex, 0, draggedItem)

    onReorderUrls(newUrls)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  if (urls.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">URLs (0)</h3>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No URLs added yet. Add your first URL above.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  //return <pre>{JSON.stringify(urls,null, 2)}</pre>

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">URLs ({urls.length})</h3>
      <div className="grid gap-4">
        {urls.map((url, index) => (
          <Card
            key={url.id}
            className={`transition-all duration-200 ${
              draggedIndex === index ? "opacity-50 scale-95" : "hover:shadow-md"
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden border bg-muted">
                    <Image
                      src={imageToUrl(url.thumbnail) || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=64&width=64&text=Error"
                      }}
                    />
                  </div>
                </div>

                {/* URLs */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-sm font-medium">#{index + 1}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    <span className="font-medium">Original:</span> {url.original}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    <span className="font-medium">Thumbnail:</span> {url.thumbnail}
                  </div>
                </div>

                {/* Remove button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveUrl(url.id)}
                  className="flex-shrink-0 text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
