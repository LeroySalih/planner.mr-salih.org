"use client"
import { useState, useRef } from "react"
import AssignmentTrackerGrid from "./assignment-tracker-grid"
import { Card } from "@/components/ui/card"
import {
  filterClasses,
  getClassTitle,
  getUnitTitle,
  createHoverState,
  getMousePosition,
} from "./utils/assignment-tracker-utils"

// Types for our data structure
export interface Unit {
  id: string
  title: string
}

export interface Assignment {
  unitId: string
  classId: string
  fromDate: Date
  endDate: Date
}

export interface ClassInfo {
  id: string
  title: string
}

interface AssignmentTrackerProps {
  classes: ClassInfo[]
  units: Unit[]
  assignments: Assignment[]
  startDate: Date
  endDate: Date
  onAssignmentChange: (assignment: Assignment, action: "create" | "edit" | "delete") => void
  onAssignmentClick?: (assignmentId: string, weekStartDate: Date, classId: string, unitId: string) => void
  onAssignmentHover?: (assignmentId: string, weekStartDate: Date, classId: string, unitId: string) => void
}

export default function AssignmentTracker({
  classes,
  units,
  assignments,
  startDate,
  endDate,
  onAssignmentChange,
  onAssignmentClick,
  onAssignmentHover,
}: AssignmentTrackerProps) {
  const [classFilter, setClassFilter] = useState("")
  const [hoveredAssignment, setHoveredAssignment] = useState<{
    assignment: Assignment
    position: { x: number; y: number }
    assignmentId: string
    weekStartDate: Date
  } | null>(null)

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const filteredClasses = filterClasses(classes, classFilter)

  const handleAssignmentHover = (
    assignmentId: string,
    weekStartDate: Date,
    classId: string,
    unitId: string,
    assignment: Assignment | null,
  ) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    if (assignment) {
      const position = getMousePosition()
      setHoveredAssignment(createHoverState(assignment, position, assignmentId, weekStartDate))

      if (onAssignmentHover) {
        onAssignmentHover(assignmentId, weekStartDate, classId, unitId)
      }
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredAssignment(null)
      }, 100)
    }
  }

  const handlePopupMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  const handlePopupMouseLeave = () => {
    setHoveredAssignment(null)
  }

  const handlePopupTitleClick = () => {
    if (hoveredAssignment && onAssignmentClick) {
      onAssignmentClick(
        hoveredAssignment.assignmentId,
        hoveredAssignment.weekStartDate,
        hoveredAssignment.assignment.classId,
        hoveredAssignment.assignment.unitId,
      )
    }
  }

  return (
    <div className="space-y-4 relative">
      <AssignmentTrackerGrid
        classes={filteredClasses}
        units={units}
        assignments={assignments}
        startDate={startDate}
        endDate={endDate}
        onAssignmentChange={onAssignmentChange}
        classFilter={classFilter}
        onClassFilterChange={setClassFilter}
        onAssignmentClick={onAssignmentClick}
        onAssignmentHover={handleAssignmentHover}
      />

      {hoveredAssignment && (
        <Card
          className="absolute z-50 p-3 shadow-lg border max-w-xs"
          style={{
            left: hoveredAssignment.position.x + 10,
            top: hoveredAssignment.position.y - 10,
            backgroundColor: "var(--assignment-grid-background)",
            color: "var(--assignment-grid-text)",
            borderColor: "var(--assignment-grid-border)",
          }}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        >
          <div className="space-y-2 text-sm">
            <button
              onClick={handlePopupTitleClick}
              className="font-semibold underline-offset-4 hover:underline cursor-pointer text-left p-0 border-none bg-transparent"
              style={{
                color: "var(--assignment-grid-text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--assignment-grid-primary)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--assignment-grid-text)"
              }}
            >
              {getUnitTitle(units, hoveredAssignment.assignment.unitId)}
            </button>
            <div style={{ color: "var(--assignment-grid-secondary)" }}>
              <div>Class: {getClassTitle(classes, hoveredAssignment.assignment.classId)}</div>
              <div>Start: {hoveredAssignment.assignment.fromDate.toLocaleDateString()}</div>
              <div>End: {hoveredAssignment.assignment.endDate.toLocaleDateString()}</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
