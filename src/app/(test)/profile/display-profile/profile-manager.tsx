"use client"

import { useState } from "react"
import { ProfileForm } from "./profile-form"
import { Switch } from "@/components/ui/switch"
import { type Profile } from "@/actions/profiles/types"
import { Label} from "@/components/ui/label";


export function ProfileManager({initialProfile}: {initialProfile: Profile}) {

  const [canEdit, setCanEdit] = useState(true)
  const [profile, setProfile] = useState<Profile>(initialProfile)

  const handleProfileChange = (updatedProfile: typeof profile) => {
    setProfile(updatedProfile)
    console.log("Profile updated:", updatedProfile)
  }

  const handleProfileSave = (formData: any) => {
    console.log("Profile saved:", formData)
    // Here you could make an API call to save the data
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Profile Information</h1>
        <div className="flex items-center space-x-2">
          <Label htmlFor="edit-mode">Edit Mode</Label>
          <Switch id="edit-mode" checked={canEdit} onCheckedChange={setCanEdit} />
        </div>
      </div>
      <ProfileForm profile={profile} onChange={handleProfileChange} onSave={handleProfileSave} can_edit={canEdit} />
    </div>
  )
}
