"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { ClassItem, ClassAction } from "../lib/class-utils"
import { ClassCard } from "./class-card"
import { CreateClassDialog } from "./create-class-dialog"
import { EditClassDialog } from "./edit-class-dialog"
import { JoinCodeModal } from "./join-code-modal"

interface ClassManagerProps {
  classes: ClassItem[]
  onClassAction: (classItem: ClassItem, action: ClassAction) => void
}

export function ClassManager({ classes, onClassAction }: ClassManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null)
  const [selectedJoinCode, setSelectedJoinCode] = useState<string | null>(null)

  const itemsPerPage = 20

  // Filter classes based on search term
  const filteredClasses = useMemo(() => {
    return classes.filter(
      (cls) =>
        cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.joinCode.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [classes, searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedClasses = filteredClasses.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleCreateClass = (newClass: ClassItem) => {
    onClassAction(newClass, "create")
  }

  const handleEditClass = (updatedClass: ClassItem) => {
    onClassAction(updatedClass, "edit")
  }

  const handleDeleteClass = (classId: string) => {
    const classToDelete = classes.find((cls) => cls.id === classId)
    if (classToDelete) {
      onClassAction(classToDelete, "delete")
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      {/* Header with search and create button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search classes by title or join code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <CreateClassDialog onClassCreate={handleCreateClass} />
      </div>

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedClasses.length} of {filteredClasses.length} classes
      </div>

      {/* Classes grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedClasses.map((classItem) => (
          <ClassCard
            key={classItem.id}
            classItem={classItem}
            onEdit={setEditingClass}
            onDelete={handleDeleteClass}
            onJoinCodeClick={setSelectedJoinCode}
          />
        ))}
      </div>

      {/* Empty state */}
      {paginatedClasses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? "No classes found matching your search." : "No classes created yet."}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => handlePageChange(page)}
              className="w-10"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <EditClassDialog classItem={editingClass} onClassEdit={handleEditClass} onClose={() => setEditingClass(null)} />

      <JoinCodeModal joinCode={selectedJoinCode} onClose={() => setSelectedJoinCode(null)} />
    </div>
  )
}
