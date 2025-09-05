"use client"

import { useState } from "react"
import AssignmentTracker, { type ClassInfo, type Unit, type Assignment } from "./assignment-tracker"

const sampleClasses: ClassInfo[] = [
  { id: "1", title: "25-8AIT" },
  { id: "2", title: "25-9CSE" },
  { id: "3", title: "25-7BIT" },
  { id: "4", title: "25-8DSE" },
  { id: "5", title: "25-9NET" },
  { id: "6", title: "25-6WEB" },
  { id: "7", title: "25-8IOT" },
  { id: "8", title: "25-9CYB" },
  { id: "9", title: "25-7GAM" },
]

const sampleUnits: Unit[] = [
  { id: "1", title: "Web Development Fundamentals" },
  { id: "2", title: "Database Design" },
  { id: "3", title: "Network Security" },
  { id: "4", title: "Mobile App Development" },
  { id: "5", title: "Data Structures" },
]

const sampleAssignments: Assignment[] = [
  {
    unitId: "1",
    classId: "1",
    fromDate: new Date("2024-01-15"),
    endDate: new Date("2024-02-15"),
  },
  {
    unitId: "2",
    classId: "2",
    fromDate: new Date("2024-01-20"),
    endDate: new Date("2024-03-01"),
  },
  {
    unitId: "3",
    classId: "1",
    fromDate: new Date("2024-02-20"),
    endDate: new Date("2024-03-20"),
  },
]

export default function Home() {
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments)

  const startDate = new Date("2025-09-01")
  const endDate = new Date("2026-09-01")

  const handleAssignmentChange = (assignment: Assignment, action: "create" | "edit" | "delete") => {
    console.log("[v0] Assignment changed:", { assignment, action })

    setAssignments((prevAssignments) => {
      switch (action) {
        case "create":
          return [...prevAssignments, assignment]
        case "edit":
          return prevAssignments.map((existing) =>
            existing.classId === assignment.classId &&
            existing.unitId === assignment.unitId &&
            existing.fromDate.getTime() === assignment.fromDate.getTime()
              ? assignment
              : existing,
          )
        case "delete":
          return prevAssignments.filter(
            (existing) =>
              !(
                existing.classId === assignment.classId &&
                existing.unitId === assignment.unitId &&
                existing.fromDate.getTime() === assignment.fromDate.getTime()
              ),
          )
        default:
          return prevAssignments
      }
    })
  }

  const handleAssignmentClick = (assignmentId: string, weekStartDate: Date, classId: string, unitId: string) => {
    console.log("[v0] Assignment clicked:", {
      assignmentId,
      weekStartDate: weekStartDate.toISOString(),
      classId,
      unitId,
    })
  }

  const handleAssignmentHover = (assignmentId: string, weekStartDate: Date, classId: string, unitId: string) => {
    console.log("[v0] Assignment hovered:", {
      assignmentId,
      weekStartDate: weekStartDate.toISOString(),
      classId,
      unitId,
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <AssignmentTracker
        classes={sampleClasses}
        units={sampleUnits}
        assignments={assignments}
        startDate={startDate}
        endDate={endDate}
        onAssignmentChange={handleAssignmentChange}
        onAssignmentClick={handleAssignmentClick}
        onAssignmentHover={handleAssignmentHover}
      />
    </main>
  )
}

