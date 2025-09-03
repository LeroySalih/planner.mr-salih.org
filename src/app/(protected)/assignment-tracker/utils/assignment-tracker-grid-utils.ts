
import type { Assignment } from "../assignment-tracker"

// Date range generation
export const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = []
  const currentDate = new Date(startDate)
  currentDate.setDate(currentDate.getDate() - currentDate.getDay())

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 7)
  }
  return dates
}

// Date formatting
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// Assignment cell detection
export const getAssignmentForCell = (
  assignments: Assignment[],
  classId: string,
  date: Date,
): Assignment | undefined => {
  return assignments.find((assignment) => {
    if (assignment.classId !== classId) return false
    const weekStart = new Date(date)
    const weekEnd = new Date(date)
    weekEnd.setDate(weekEnd.getDate() + 6)

    return assignment.fromDate <= weekEnd && assignment.endDate >= weekStart
  })
}

// Week status determination
export const getWeekStatus = (weekStartDate: Date): "past" | "current" | "future" => {
  const today = new Date()
  const currentWeekStart = new Date(today)
  currentWeekStart.setDate(today.getDate() - today.getDay()) // Start of current week (Sunday)

  const weekStart = new Date(weekStartDate)

  if (weekStart < currentWeekStart) {
    return "past"
  } else if (weekStart.getTime() === currentWeekStart.getTime()) {
    return "current"
  } else {
    return "future"
  }
}

// Assignment styling based on week status
export const getAssignmentStyling = (weekStartDate: Date): string => {
  const status = getWeekStatus(weekStartDate)
  switch (status) {
    case "past":
      return "bg-slate-200 text-slate-700 hover:bg-slate-300"
    case "current":
      return "bg-green-600 text-white hover:bg-green-700"
    case "future":
      return "bg-green-200 text-green-800 hover:bg-green-300"
    default:
      return "bg-accent text-accent-foreground hover:bg-accent/80"
  }
}

// Form data management
export const createWeekDateRange = (weekStartDate: Date): { start: string; end: string } => {
  const weekEndDate = new Date(weekStartDate)
  weekEndDate.setDate(weekEndDate.getDate() + 6)

  return {
    start: weekStartDate.toISOString().split("T")[0],
    end: weekEndDate.toISOString().split("T")[0],
  }
}

// Class selection utilities
export const toggleClassInSelection = (selectedClassIds: string[], classId: string, checked: boolean): string[] => {
  return checked ? [...selectedClassIds, classId] : selectedClassIds.filter((id) => id !== classId)
}

export const removeClassFromSelection = (selectedClassIds: string[], classId: string): string[] => {
  return selectedClassIds.filter((id) => id !== classId)
}
