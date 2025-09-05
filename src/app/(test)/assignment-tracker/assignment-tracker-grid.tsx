"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Calendar, BookOpen, Trash2, Search, X } from "lucide-react"

import type { Unit, Assignment, ClassInfo } from "./assignment-tracker"
import {
  generateDateRange,
  formatDate,
  getAssignmentForCell,
  getAssignmentStyling,
  createWeekDateRange,
  toggleClassInSelection,
  removeClassFromSelection,
} from "./utils/assignment-tracker-grid-utils"
import { getUnitTitle, generateAssignmentId } from "./utils/assignment-tracker-utils"

interface AssignmentTrackerGridProps {
  classes: ClassInfo[]
  units: Unit[]
  assignments: Assignment[]
  startDate: Date
  endDate: Date
  onAssignmentChange: (assignment: Assignment, action: "create" | "edit" | "delete") => void
  classFilter: string
  onClassFilterChange: (filter: string) => void
  onAssignmentClick?: (assignmentId: string, weekStartDate: Date, classId: string, unitId: string) => void
  onAssignmentHover?: (
    assignmentId: string,
    weekStartDate: Date,
    classId: string,
    unitId: string,
    assignment: Assignment | null,
  ) => void
}

export default function AssignmentTrackerGrid({
  classes,
  units,
  assignments,
  startDate,
  endDate,
  onAssignmentChange,
  classFilter,
  onClassFilterChange,
  onAssignmentClick,
  onAssignmentHover,
}: AssignmentTrackerGridProps) {
  const [selectedCell, setSelectedCell] = useState<{ classId: string; date: Date } | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [dialogClassFilter, setDialogClassFilter] = useState("")
  const [formData, setFormData] = useState({
    selectedClassIds: [] as string[],
    unitId: "",
    fromDate: "",
    endDate: "",
  })

  const dateRange = generateDateRange(startDate, endDate)

  const getAssignmentForCellWrapper = (classId: string, date: Date) => {
    return getAssignmentForCell(assignments, classId, date)
  }

  const handleSubmitAssignment = () => {
    if (formData.selectedClassIds.length > 0 && formData.unitId && formData.fromDate && formData.endDate) {
      if (editingAssignment) {
        const assignmentData: Assignment = {
          unitId: formData.unitId,
          classId: formData.selectedClassIds[0],
          fromDate: new Date(formData.fromDate),
          endDate: new Date(formData.endDate),
        }
        onAssignmentChange(assignmentData, "edit")
      } else {
        const newAssignments = formData.selectedClassIds.map((classId) => ({
          unitId: formData.unitId,
          classId: classId,
          fromDate: new Date(formData.fromDate),
          endDate: new Date(formData.endDate),
        }))

        newAssignments.forEach((assignment) => {
          onAssignmentChange(assignment, "create")
        })

        if (classFilter) {
          onClassFilterChange("")
        }
      }

      resetForm()
    }
  }

  const resetForm = () => {
    setFormData({ selectedClassIds: [], unitId: "", fromDate: "", endDate: "" })
    setEditingAssignment(null)
    setDialogClassFilter("")
    setIsDialogOpen(false)
  }

  const handleDeleteAssignment = () => {
    if (editingAssignment) {
      onAssignmentChange(editingAssignment, "delete")
      resetForm()
    }
  }

  const handleAssignmentClick = (assignment: Assignment, weekStartDate: Date) => {
    if (onAssignmentClick) {
      const assignmentId = generateAssignmentId(assignment)
      onAssignmentClick(assignmentId, weekStartDate, assignment.classId, assignment.unitId)
    }

    setEditingAssignment(assignment)
    setFormData({
      selectedClassIds: [assignment.classId],
      unitId: assignment.unitId,
      fromDate: assignment.fromDate.toISOString().split("T")[0],
      endDate: assignment.endDate.toISOString().split("T")[0],
    })
    setIsDialogOpen(true)
  }

  const handleAddNewAssignment = () => {
    setEditingAssignment(null)
    setFormData({ selectedClassIds: [], unitId: "", fromDate: "", endDate: "" })
    setIsDialogOpen(true)
  }

  const handleEmptyCellClick = (classId: string, weekStartDate: Date) => {
    setEditingAssignment(null)
    const { start, end } = createWeekDateRange(weekStartDate)

    setFormData({
      selectedClassIds: [classId],
      unitId: "",
      fromDate: start,
      endDate: end,
    })
    setIsDialogOpen(true)
  }

  const handleClassToggle = (classId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedClassIds: toggleClassInSelection(prev.selectedClassIds, classId, checked),
    }))
  }

  const handleRemoveClass = (classId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedClassIds: removeClassFromSelection(prev.selectedClassIds, classId),
    }))
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAssignmentHover = (assignment: Assignment | null, weekStartDate: Date, classId: string) => {
    if (onAssignmentHover && assignment) {
      const assignmentId = generateAssignmentId(assignment)
      onAssignmentHover(assignmentId, weekStartDate, assignment.classId, assignment.unitId, assignment)
    } else if (onAssignmentHover && !assignment) {
      onAssignmentHover("", weekStartDate, classId, "", null)
    }
  }

  const handleAssignmentLeave = () => {
    if (onAssignmentHover) {
      onAssignmentHover("", new Date(), "", "", null)
    }
  }

  const gridCols = "grid grid-cols-[200px_repeat(var(--weeks),120px)]"

  return (
    <div className="w-full p-6 bg-background">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6" style={{ color: "var(--assignment-grid-primary)" }} />
            <h1 className="text-2xl font-bold text-foreground">Assignment Tracker</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-white"
                style={{
                  backgroundColor: "var(--assignment-grid-primary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--assignment-grid-primary-hover)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--assignment-grid-primary)"
                }}
                onClick={handleAddNewAssignment}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingAssignment ? "Edit Assignment" : "Add New Assignment"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="class">
                    {editingAssignment ? "Class" : "Classes"}
                    {!editingAssignment && <span className="text-muted-foreground ml-1">(select multiple)</span>}
                  </Label>
                  {editingAssignment ? (
                    <div className="p-3 border rounded-md bg-muted">
                      {classes.find((c) => c.id === formData.selectedClassIds[0])?.title || "Unknown Class"}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.selectedClassIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/30">
                          {formData.selectedClassIds.map((classId) => {
                            const classInfo = classes.find((c) => c.id === classId)
                            return (
                              <Badge
                                key={classId}
                                variant="secondary"
                                className="flex items-center gap-1 text-white"
                                style={{ backgroundColor: "var(--assignment-grid-primary)" }}
                              >
                                {classInfo?.title}
                                <X
                                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                                  onClick={() => handleRemoveClass(classId)}
                                />
                              </Badge>
                            )
                          })}
                        </div>
                      )}
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Filter classes..."
                          value={dialogClassFilter}
                          onChange={(e) => setDialogClassFilter(e.target.value)}
                          className="pl-8 h-9"
                        />
                      </div>
                      <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
                        {classes
                          .filter((classInfo) =>
                            classInfo.title.toLowerCase().includes(dialogClassFilter.toLowerCase()),
                          )
                          .map((classInfo) => (
                            <div key={classInfo.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`class-${classInfo.id}`}
                                checked={formData.selectedClassIds.includes(classInfo.id)}
                                onCheckedChange={(checked) => handleClassToggle(classInfo.id, checked as boolean)}
                              />
                              <Label
                                htmlFor={`class-${classInfo.id}`}
                                className="text-sm font-normal cursor-pointer flex-1"
                              >
                                {classInfo.title}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unitId} onValueChange={(value) => handleFormChange("unitId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fromDate">Start Date</Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => handleFormChange("fromDate", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleFormChange("endDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  {editingAssignment && (
                    <Button variant="destructive" onClick={handleDeleteAssignment}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitAssignment}
                    disabled={formData.selectedClassIds.length === 0}
                    className="text-white"
                    style={{
                      backgroundColor: "var(--assignment-grid-primary)",
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = "var(--assignment-grid-primary-hover)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = "var(--assignment-grid-primary)"
                      }
                    }}
                  >
                    {editingAssignment
                      ? "Update Assignment"
                      : `Add Assignment${formData.selectedClassIds.length > 1 ? "s" : ""}`}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Track unit assignments across classes and dates</span>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-auto max-h-[600px]">
          <div className="min-w-max relative">
            <div
              className={`${gridCols} sticky top-0 z-20`}
              style={{
                ["--weeks" as any]: String(dateRange.length),
                backgroundColor: "var(--assignment-grid-primary)",
                color: "var(--assignment-grid-text-light)",
              }}
            >
              <div
                className="p-4 font-semibold border-r sticky left-0 z-30"
                style={{
                  backgroundColor: "var(--assignment-grid-primary)",
                  borderColor: "var(--assignment-grid-text-light)",
                  opacity: 0.2,
                }}
              >
                <div className="mb-2">Class</div>
                <div className="relative">
                  <Search
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3"
                    style={{ color: "var(--assignment-grid-text-light)", opacity: 0.6 }}
                  />
                  <Input
                    type="text"
                    placeholder="Filter..."
                    value={classFilter}
                    onChange={(e) => onClassFilterChange(e.target.value)}
                    className="pl-7 h-7 text-xs border"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      color: "var(--assignment-grid-text-light)",
                    }}
                  />
                </div>
              </div>
              {dateRange.map((date, index) => (
                <div
                  key={index}
                  className="p-4 text-center font-medium border-r last:border-r-0"
                  style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  <div className="text-sm">{formatDate(date)}</div>
                  <div className="text-xs opacity-80">Week {index + 1}</div>
                </div>
              ))}
            </div>

            {classes
              .filter((classInfo) => classInfo.title.toLowerCase().includes(classFilter.toLowerCase()))
              .map((classInfo, rowIndex) => (
                <div
                  key={classInfo.id}
                  className={`${gridCols} ${rowIndex % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
                  style={{ ["--weeks" as any]: String(dateRange.length) }}
                >
                  <div className="p-4 font-medium border-r border-border bg-card sticky left-0 z-10">
                    <div className="text-foreground">{classInfo.title}</div>
                  </div>

                  {dateRange.map((date, colIndex) => {
                    const assignment = getAssignmentForCellWrapper(classInfo.id, date)
                    const isAssigned = !!assignment

                    return (
                      <div
                        key={colIndex}
                        className={`p-2 border-r border-border last:border-r-0 min-h-[60px] cursor-pointer transition-colors ${
                          isAssigned ? getAssignmentStyling(date) : "hover:bg-accent/10"
                        }`}
                        onClick={() => {
                          if (assignment) {
                            handleAssignmentClick(assignment, date)
                          } else {
                            handleEmptyCellClick(classInfo.id, date)
                          }
                        }}
                        onMouseEnter={() => assignment && handleAssignmentHover(assignment, date, classInfo.id)}
                        onMouseLeave={handleAssignmentLeave}
                      >
                        {isAssigned && assignment && (
                          <Badge
                            variant="secondary"
                            className={`text-xs w-full justify-center ${getAssignmentStyling(date)}`}
                          >
                            {getUnitTitle(units, assignment.unitId).substring(0, 15)}
                            {getUnitTitle(units, assignment.unitId).length > 15 && "..."}
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
          </div>
        </div>
      </Card>

      <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 border rounded"
            style={{
              backgroundColor: "var(--assignment-grid-secondary)",
              borderColor: "var(--assignment-grid-border)",
            }}
          ></div>
          <span>Past Assignments</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 border rounded"
            style={{
              backgroundColor: "var(--assignment-grid-primary)",
              borderColor: "var(--assignment-grid-border)",
            }}
          ></div>
          <span>Current Week</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 border rounded"
            style={{
              backgroundColor: "var(--assignment-grid-primary-light)",
              borderColor: "var(--assignment-grid-border)",
            }}
          ></div>
          <span>Future Assignments</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 border rounded"
            style={{
              backgroundColor: "var(--assignment-grid-background)",
              borderColor: "var(--assignment-grid-border)",
            }}
          ></div>
          <span>Available</span>
        </div>
      </div>
    </div>
  )
}
