"use client"

import { useState } from "react"
import { Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface Option {
  id: string
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  placeholder?: string
  initialValues?: string[]
  onSelectionChange?: (selectedValues: string[]) => void
}

export default function MultiSelectCheckboxes({
  options = [],
  placeholder = "Select learning objectives...",
  initialValues = [],
  onSelectionChange,
}: MultiSelectProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues)
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const newSelectedValues = checked ? [...selectedValues, value] : selectedValues.filter((v) => v !== value)

    setSelectedValues(newSelectedValues)
    onSelectionChange?.(newSelectedValues)
  }

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder
    }
    if (selectedValues.length === 1) {
      const selectedOption = options.find((option) => option.value === selectedValues[0])
      return selectedOption?.label || selectedValues[0]
    }
    return `${selectedValues.length} items selected`
  }

  return (
    <div className="w-full max-w-sm">
      <DropdownMenu
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
            setSearchTerm("")
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full" aria-label="Select options">
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full p-0" align="start">
          <div className="p-2 border-b">
            <Input
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="max-h-60 overflow-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => {
                    const isChecked = selectedValues.includes(option.value)
                    handleCheckboxChange(option.value, !isChecked)
                  }}
                >
                  <Checkbox
                    id={option.id}
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={(checked) => {
                      handleCheckboxChange(option.value, checked as boolean)
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer text-sm font-normal">
                    {option.label}
                  </Label>
                  {selectedValues.includes(option.value) && <Check className="h-4 w-4 text-primary" />}
                </div>
              ))
            )}
          </div>
          {selectedValues.length > 0 && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSelectedValues([])
                  onSelectionChange?.([])
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>


    </div>
  )
}
