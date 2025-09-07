"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type Profile } from "@/actions/profiles/types"

interface Group {
  type: string
  group_id: string
  title: string
  role: string
}



interface ProfileFormProps {
  profile: Profile
  onChange?: (updatedProfile: Profile) => void
  onSave?: (formData: any) => void
  can_edit?: boolean
}

export function ProfileForm({ profile, onChange, onSave, can_edit = true }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    first_name: profile.first_name,
    last_name: profile.last_name,
    is_teacher: profile.is_teacher,
    active: profile.active,
  })

  useEffect(() => {
    setFormData({
      first_name: profile.first_name,
      last_name: profile.last_name,
      is_teacher: profile.is_teacher,
      active: profile.active,
    })
  }, [profile])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleInputBlur = (field: string, value: string | boolean) => {
    if (onChange) {
      const updatedProfile = { ...profile, [field]: value }
      onChange(updatedProfile)
    }
  }

  const handleSwitchChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }))

    if (onChange) {
      const updatedProfile = { ...profile, [field]: checked }
      onChange(updatedProfile)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave(formData)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>{can_edit ? "View and edit profile information" : "View profile information"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name || ""}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                onBlur={(e) => handleInputBlur("first_name", e.target.value)}
                placeholder="Enter first name"
                disabled={!can_edit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name || ""}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                onBlur={(e) => handleInputBlur("last_name", e.target.value)}
                placeholder="Enter last name"
                disabled={!can_edit}
              />
            </div>
          </div>

          {/* Email Addresses */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Email Addresses</Label>
              <p className="text-sm text-muted-foreground">Contact email addresses (read-only)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={profile.email || "Not provided"} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_email">Father Email</Label>
                <Input id="father_email" value={profile.father_email || "Not provided"} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_email">Mother Email</Label>
                <Input id="mother_email" value={profile.mother_email || "Not provided"} disabled className="bg-muted" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_teacher">Teacher Status</Label>
                <p className="text-sm text-muted-foreground">Enable if this user is a teacher</p>
              </div>
              <Switch
                id="is_teacher"
                checked={formData.is_teacher}
                onCheckedChange={(checked) => handleSwitchChange("is_teacher", checked)}
                disabled={!can_edit}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active Status</Label>
                <p className="text-sm text-muted-foreground">Enable if this profile is active</p>
              </div>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleSwitchChange("active", checked)}
                disabled={!can_edit}
              />
            </div>
          </div>

          <Separator />
          

          {/* Additional Info - only show in edit mode */}
          {can_edit && (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">User ID:</span> {profile.user_id}
              </p>
              <p>
                <span className="font-medium">Created:</span> {new Date(profile.created).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Created By:</span> {profile.created_by}
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}




