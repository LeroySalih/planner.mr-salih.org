export interface ClassItem {
  id: string
  title: string
  joinCode: string
}

export type ClassAction = "create" | "edit" | "delete"

// Generate a random GUID
export function generateGuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Generate a random 6-character join code
export function generateJoinCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Create a new class with generated ID and join code
export function createClass(title: string): ClassItem {
  return {
    id: generateGuid(),
    title,
    joinCode: generateJoinCode(),
  }
}

// Generate mock data for demonstration
export function generateMockClasses(count = 45): ClassItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: generateGuid(),
    title: `Class ${i + 1}`,
    joinCode: generateJoinCode(),
  }))
}
