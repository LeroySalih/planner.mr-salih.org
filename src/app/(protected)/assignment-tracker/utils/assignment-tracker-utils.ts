import type { ClassInfo, Unit, Assignment } from "../assignment-tracker"

// Filtering utilities
export const filterClasses = (classes: ClassInfo[], filter: string): ClassInfo[] => {
  return classes.filter((classInfo) => classInfo.title.toLowerCase().includes(filter.toLowerCase()))
}

// Data lookup utilities
export const getClassTitle = (classes: ClassInfo[], classId: string): string => {
  return classes.find((c) => c.id === classId)?.title || "Unknown Class"
}

export const getUnitTitle = (units: Unit[], unitId: string): string => {
  return units.find((u) => u.id === unitId)?.title || "Unknown Unit"
}

// Hover management utilities
export const createHoverState = (
  assignment: Assignment,
  position: { x: number; y: number },
  assignmentId: string,
  weekStartDate: Date,
) => ({
  assignment,
  position,
  assignmentId,
  weekStartDate,
})

export const getMousePosition = (): { x: number; y: number } => {
  const mouseEvent = window.event as MouseEvent
  return { x: mouseEvent?.clientX || 0, y: mouseEvent?.clientY || 0 }
}

// Assignment ID generation
export const generateAssignmentId = (assignment: Assignment): string => {
  return `${assignment.classId}-${assignment.unitId}-${assignment.fromDate.getTime()}`
}
