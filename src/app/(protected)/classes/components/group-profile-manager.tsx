"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AdminDashboard } from "./admin-dashboard"
import { type Group, type Profile, initialGroups, initialProfiles } from "../data/test-data"

type DataChangeType = "create" | "edit" | "delete"

type DataChangeCallback<T> = (data: T, changeType: DataChangeType) => void

export default function GroupProfileManager() {
  // const { toast } = useToast()

  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)

  const handleGroupChange: DataChangeCallback<Group> = (group, changeType) => {
    console.log(`[v0] Group ${changeType} operation:`, group)

    switch (changeType) {
      case "create":
        setGroups((prev) => {
          const newGroups = [...prev, group]
          console.log(`[v0] Groups after create:`, newGroups.length)
          return newGroups
        })
        toast.success(
          "Success",{
          description: `Group "${group.title}" created successfully`,
        })
        break
      case "edit":
        setGroups((prev) => {
          const updatedGroups = prev.map((g) => (g.id === group.id ? group : g))
          console.log(`[v0] Group "${group.title}" updated`)
          return updatedGroups
        })
        toast("Success",{
          description: `Group "${group.title}" updated successfully`,
        })
        break
      case "delete":
        setGroups((prev) => {
          const filteredGroups = prev.filter((g) => g.id !== group.id)
          console.log(`[v0] Groups after delete:`, filteredGroups.length)
          return filteredGroups
        })
        toast("Success",{
          description: `Group "${group.title}" deleted successfully`,
        })
        break
    }
  }

  const handleProfileChange: DataChangeCallback<Profile> = (profile, changeType) => {
    console.log(`[v0] Profile ${changeType} operation:`, profile)

    switch (changeType) {
      case "create":
        setProfiles((prev) => {
          const newProfiles = [...prev, profile]
          console.log(`[v0] Profiles after create:`, newProfiles.length)
          return newProfiles
        })
        toast("Success",{
          description: `Profile for "${profile.name}" created successfully`,
        })
        break
      case "edit":
        setProfiles((prev) => {
          const updatedProfiles = prev.map((p) => (p.id === profile.id ? profile : p))
          console.log(`[v0] Profile "${profile.name}" updated`)
          return updatedProfiles
        })
        toast("Success",{
          description: `Profile for "${profile.name}" updated successfully`,
        })
        break
      case "delete":
        setProfiles((prev) => {
          const filteredProfiles = prev.filter((p) => p.id !== profile.id)
          console.log(`[v0] Profiles after delete:`, filteredProfiles.length)
          return filteredProfiles
        })
        toast("Success",{
          description: `Profile for "${profile.name}" deleted successfully`,
        })
        break
    }
  }

  return (
    <AdminDashboard
      groups={groups}
      profiles={profiles}
      onGroupChange={handleGroupChange}
      onProfileChange={handleProfileChange}
    />
  )
}

export { GroupProfileManager }
