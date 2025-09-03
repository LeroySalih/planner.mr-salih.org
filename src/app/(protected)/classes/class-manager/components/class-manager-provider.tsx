"use client"

import { useState } from "react"
import { ClassManager } from "./class-manager"
import { toast } from "sonner"
import { type ClassItem, type ClassAction, generateMockClasses } from "../lib/class-utils"

const initialClasses: ClassItem[] = generateMockClasses(45)

export function ClassManagerProvider() {
  const [classes, setClasses] = useState<ClassItem[]>(initialClasses)
  
  const handleClassAction = (classItem: ClassItem, action: ClassAction) => {
    switch (action) {
      case "create":
        setClasses((prev) => [classItem, ...prev])
        toast.success(
          "Success",{
          description: "Class created successfully",
        })
        break
      case "edit":
        setClasses((prev) => prev.map((cls) => (cls.id === classItem.id ? classItem : cls)))
        toast.success("Success",
          {
          description: "Class updated successfully",
        })
        break
      case "delete":
        setClasses((prev) => prev.filter((cls) => cls.id !== classItem.id))
        toast.success("Success",{
          description: "Class deleted successfully",
        })
        break
    }
  }

  return <ClassManager classes={classes} onClassAction={handleClassAction} />
}
