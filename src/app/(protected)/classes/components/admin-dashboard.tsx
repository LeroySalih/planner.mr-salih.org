"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Search, X } from "lucide-react"
import { toast} from "sonner";


interface Group {
  id: string
  title: string
  joinCode: string
  memberCount: number
  createdAt: string
}

interface Profile {
  id: string
  name: string
  email: string
  motherEmail: string
  fatherEmail: string
  groups: { id: string; title: string }[]
  joinedAt: string
  is_teacher: boolean
}

type DataChangeType = "create" | "edit" | "delete"

interface AdminDashboardProps {
  groups: Group[]
  profiles: Profile[]
  onGroupChange: (group: Group, changeType: DataChangeType) => void
  onProfileChange: (profile: Profile, changeType: DataChangeType) => void
}

export default function AdminDashboard({ groups, profiles, onGroupChange, onProfileChange }: AdminDashboardProps) {
  //const { toast } = useToast()

  const [editingGroupTitle, setEditingGroupTitle] = useState<string | null>(null)
  const [editingGroupTitleValue, setEditingGroupTitleValue] = useState("")

  const [newGroup, setNewGroup] = useState({ title: "", joinCode: "" })
  const [newProfile, setNewProfile] = useState({
    name: "",
    email: "",
    motherEmail: "",
    fatherEmail: "",
    selectedGroups: [] as string[],
    is_teacher: false,
  })
  const [editingCell, setEditingCell] = useState<{ profileId: string; field: string } | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [fullscreenJoinCode, setFullscreenJoinCode] = useState<{ code: string; title: string } | null>(null)
  const [editGroup, setEditGroup] = useState<Group | null>(null)
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false)
  const [editProfile, setEditProfile] = useState<Profile | null>(null)
  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false)
  const [editProfileGroups, setEditProfileGroups] = useState<Profile | null>(null)
  const [isEditProfileGroupsDialogOpen, setIsEditProfileGroupsDialogOpen] = useState(false)
  const [groupsDialogFilter, setGroupsDialogFilter] = useState("")
  const [groupFilter, setGroupFilter] = useState("")
  const [profileFilter, setProfileFilter] = useState("")
  const [groupsCurrentPage, setGroupsCurrentPage] = useState(1)
  const [profilesCurrentPage, setProfilesCurrentPage] = useState(1)
  const itemsPerPage = 10

  const startEditingGroupTitle = (groupId: string, currentTitle: string) => {
    setEditingGroupTitle(groupId)
    setEditingGroupTitleValue(currentTitle)
  }

  const saveGroupTitle = (groupId: string) => {
    if (editingGroupTitleValue.trim()) {
      const groupToUpdate = groups.find((g) => g.id === groupId)
      if (groupToUpdate) {
        onGroupChange({ ...groupToUpdate, title: editingGroupTitleValue.trim() }, "edit")
      }
    }
    setEditingGroupTitle(null)
    setEditingGroupTitleValue("")
  }

  const cancelEditingGroupTitle = () => {
    setEditingGroupTitle(null)
    setEditingGroupTitleValue("")
  }

  const generateJoinCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setNewGroup((prev) => ({ ...prev, joinCode: code }))
  }

  const handleAddProfile = () => {
    if (!newProfile.name || !newProfile.email) {
      toast.error(
         "Error",
        {description: "Please fill in all required fields."})
      return
    }

    const selectedGroups = groups
      .filter((group) => newProfile.selectedGroups.includes(group.id))
      .map((group) => ({ id: group.id, title: group.title }))

    const profile: Profile = {
      id: Date.now().toString(),
      name: newProfile.name,
      email: newProfile.email,
      motherEmail: newProfile.motherEmail,
      fatherEmail: newProfile.fatherEmail,
      groups: selectedGroups,
      joinedAt: new Date().toISOString().split("T")[0],
      is_teacher: newProfile.is_teacher,
    }

    onProfileChange(profile, "create")
    setNewProfile({ name: "", email: "", motherEmail: "", fatherEmail: "", selectedGroups: [], is_teacher: false })
    setIsProfileDialogOpen(false)
  }

  const createGroup = () => {
    if (!newGroup.title || !newGroup.joinCode) {
      toast("Error",
        {description: "Please fill in all fields"})
      return
    }

    const group: Group = {
      id: Date.now().toString(),
      title: newGroup.title,
      joinCode: newGroup.joinCode,
      memberCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    onGroupChange(group, "create")
    setNewGroup({ title: "", joinCode: "" })
    setIsGroupDialogOpen(false)
  }

  const copyJoinCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Copied",{
      description: "Join code copied to clipboard",
    })
  }

  const showFullscreenJoinCode = (code: string, title: string) => {
    setFullscreenJoinCode({ code, title })
  }

  const closeFullscreenJoinCode = () => {
    setFullscreenJoinCode(null)
  }

  const deleteGroup = (id: string) => {
    const groupToDelete = groups.find((g) => g.id === id)
    if (groupToDelete) {
      onGroupChange(groupToDelete, "delete")
    }
  }

  const deleteProfile = (id: string) => {
    const profileToDelete = profiles.find((p) => p.id === id)
    if (profileToDelete) {
      onProfileChange(profileToDelete, "delete")
    }
  }

  const updateEditGroup = () => {
    if (!editGroup) return

    onGroupChange(editGroup, "edit")
    setIsEditGroupDialogOpen(false)
    setEditGroup(null)
  }

  const updateEditProfile = () => {
    if (!editProfile) return

    const selectedGroups = groups
      .filter((group) => editProfile.groups.some((g) => g.id === group.id))
      .map((group) => ({ id: group.id, title: group.title }))

    const updatedProfile = {
      ...editProfile,
      groups: selectedGroups,
    }

    onProfileChange(updatedProfile, "edit")
    setIsEditProfileDialogOpen(false)
    setEditProfile(null)
  }

  const updateProfileGroups = () => {
    if (!editProfileGroups) return

    const selectedGroups = groups
      .filter((group) => editProfileGroups.groups.some((g) => g.id === group.id))
      .map((group) => ({ id: group.id, title: group.title }))

    const updatedProfile = {
      ...editProfileGroups,
      groups: selectedGroups,
    }

    onProfileChange(updatedProfile, "edit")
    setIsEditProfileGroupsDialogOpen(false)
    setEditProfileGroups(null)
  }

  const toggleRole = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId)
    if (profile) {
      onProfileChange({ ...profile, is_teacher: !profile.is_teacher }, "edit")
    }
  }

  const toggleGroupSelection = (groupId: string, isNewProfile = true) => {
    if (isNewProfile) {
      setNewProfile((prev) => ({
        ...prev,
        selectedGroups: prev.selectedGroups.includes(groupId)
          ? prev.selectedGroups.filter((id) => id !== groupId)
          : [...prev.selectedGroups, groupId],
      }))
    } else if (editProfile) {
      setEditProfile((prev) =>
        prev
          ? {
              ...prev,
              groups: prev.groups.some((g) => g.id === groupId)
                ? prev.groups.filter((g) => g.id !== groupId)
                : [...prev.groups, { id: groupId, title: groups.find((g) => g.id === groupId)?.title || "" }],
            }
          : null,
      )
    }
  }

  const openEditGroupDialog = (group: Group) => {
    setEditGroup({ ...group })
    setIsEditGroupDialogOpen(true)
  }

  const openEditProfileDialog = (profile: Profile) => {
    setEditProfile({ ...profile })
    setIsEditProfileDialogOpen(true)
  }

  const openEditProfileGroupsDialog = (profile: Profile) => {
    setEditProfileGroups({ ...profile })
    setIsEditProfileGroupsDialogOpen(true)
    setGroupsDialogFilter("")
  }

  const toggleGroupSelectionForGroupsEdit = (groupId: string) => {
    if (editProfileGroups) {
      setEditProfileGroups((prev) =>
        prev
          ? {
              ...prev,
              groups: prev.groups.some((g) => g.id === groupId)
                ? prev.groups.filter((g) => g.id !== groupId)
                : [...prev.groups, { id: groupId, title: groups.find((g) => g.id === groupId)?.title || "" }],
            }
          : null,
      )
    }
  }

  const filteredGroups = groups.filter(
    (group) =>
      group.title.toLowerCase().includes(groupFilter.toLowerCase()) ||
      group.joinCode.toLowerCase().includes(groupFilter.toLowerCase()),
  )

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(profileFilter.toLowerCase()) ||
      profile.email.toLowerCase().includes(profileFilter.toLowerCase()) ||
      profile.motherEmail.toLowerCase().includes(profileFilter.toLowerCase()) ||
      profile.fatherEmail.toLowerCase().includes(profileFilter.toLowerCase()),
  )

  const totalGroupsPages = Math.ceil(filteredGroups.length / itemsPerPage)
  const totalProfilesPages = Math.ceil(filteredProfiles.length / itemsPerPage)

  const paginatedGroups = filteredGroups.slice((groupsCurrentPage - 1) * itemsPerPage, groupsCurrentPage * itemsPerPage)

  const paginatedProfiles = filteredProfiles.slice(
    (profilesCurrentPage - 1) * itemsPerPage,
    profilesCurrentPage * itemsPerPage,
  )

  useEffect(() => {
    setGroupsCurrentPage(1)
  }, [groupFilter])

  useEffect(() => {
    setProfilesCurrentPage(1)
  }, [profileFilter])

  const filteredGroupsForDialog = groups.filter((group) =>
    group.title.toLowerCase().includes(groupsDialogFilter.toLowerCase()),
  )

  const startEditing = (profileId: string, field: string, currentValue: string) => {
    setEditingCell({ profileId, field })
    setEditingValue(currentValue)
  }

  const saveEdit = () => {
    if (!editingCell) return

    const profile = profiles.find((p) => p.id === editingCell.profileId)
    if (profile) {
      onProfileChange({ ...profile, [editingCell.field]: editingValue }, "edit")
    }

    setEditingCell(null)
    setEditingValue("")
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setEditingValue("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit()
    } else if (e.key === "Escape") {
      cancelEdit()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-card-foreground">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Management Tabs */}
          <Tabs defaultValue="groups" className="space-y-4">
            <TabsList>
              <TabsTrigger value="groups">Group Management</TabsTrigger>
              <TabsTrigger value="profiles">Profile Management</TabsTrigger>
            </TabsList>

            <TabsContent value="groups" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Groups</CardTitle>
                      <CardDescription>Manage student groups and join codes</CardDescription>
                    </div>
                    <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Create Group</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Group</DialogTitle>
                          <DialogDescription>Add a new group for students to join</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="title">Group Title</Label>
                            <Input
                              id="title"
                              value={newGroup.title}
                              onChange={(e) => setNewGroup((prev) => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., Mathematics Year 10"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="joinCode">Join Code</Label>
                            <div className="flex gap-2">
                              <Input
                                id="joinCode"
                                value={newGroup.joinCode}
                                onChange={(e) =>
                                  setNewGroup((prev) => ({ ...prev, joinCode: e.target.value.toUpperCase() }))
                                }
                                placeholder="Enter or generate code"
                              />
                              <Button type="button" variant="outline" onClick={generateJoinCode}>
                                Generate
                              </Button>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={createGroup}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Create Group
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Filter groups by title or join code..."
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Join Code</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">
                            {editingGroupTitle === group.id ? (
                              <Input
                                value={editingGroupTitleValue}
                                onChange={(e) => setEditingGroupTitleValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    saveGroupTitle(group.id)
                                  } else if (e.key === "Escape") {
                                    cancelEditingGroupTitle()
                                  }
                                }}
                                onBlur={() => saveGroupTitle(group.id)}
                                className="h-8"
                                autoFocus
                              />
                            ) : (
                              <span
                                className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                                onClick={() => startEditingGroupTitle(group.id, group.title)}
                              >
                                {group.title}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="font-mono cursor-pointer hover:bg-primary/10 transition-colors"
                              onClick={() => showFullscreenJoinCode(group.joinCode, group.title)}
                            >
                              {group.joinCode}
                            </Badge>
                          </TableCell>
                          <TableCell>{group.memberCount}</TableCell>
                          <TableCell>{group.createdAt}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteGroup(group.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {totalGroupsPages > 1 && (
                    <div className="flex items-center justify-between px-2 py-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {(groupsCurrentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(groupsCurrentPage * itemsPerPage, filteredGroups.length)} of {filteredGroups.length}{" "}
                        groups
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGroupsCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={groupsCurrentPage === 1}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalGroupsPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={page === groupsCurrentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setGroupsCurrentPage(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGroupsCurrentPage((prev) => Math.min(prev + 1, totalGroupsPages))}
                          disabled={groupsCurrentPage === totalGroupsPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profiles" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Student Profiles</CardTitle>
                      <CardDescription>Manage student accounts and group assignments</CardDescription>
                    </div>
                    <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Add Student</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Student</DialogTitle>
                          <DialogDescription>
                            Create a new student profile with parent contact information
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Student Name</Label>
                            <Input
                              id="name"
                              value={newProfile.name}
                              onChange={(e) => setNewProfile((prev) => ({ ...prev, name: e.target.value }))}
                              placeholder="e.g., John Doe"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Student Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newProfile.email}
                              onChange={(e) => setNewProfile((prev) => ({ ...prev, email: e.target.value }))}
                              placeholder="e.g., john.doe@school.edu"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="motherEmail">Mother's Email</Label>
                            <Input
                              id="motherEmail"
                              type="email"
                              value={newProfile.motherEmail}
                              onChange={(e) => setNewProfile((prev) => ({ ...prev, motherEmail: e.target.value }))}
                              placeholder="e.g., mother@email.com"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="fatherEmail">Father's Email</Label>
                            <Input
                              id="fatherEmail"
                              type="email"
                              value={newProfile.fatherEmail}
                              onChange={(e) => setNewProfile((prev) => ({ ...prev, fatherEmail: e.target.value }))}
                              placeholder="e.g., father@email.com"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="is_teacher"
                              checked={newProfile.is_teacher}
                              onCheckedChange={(checked) =>
                                setNewProfile((prev) => ({ ...prev, is_teacher: !!checked }))
                              }
                            />
                            <Label htmlFor="is_teacher" className="text-sm font-medium">
                              This person is a teacher
                            </Label>
                          </div>
                          <div className="grid gap-2">
                            <Label>Select Groups (Optional)</Label>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {groups.map((group) => (
                                <div key={group.id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`group-${group.id}`}
                                    checked={newProfile.selectedGroups.includes(group.id)}
                                    onCheckedChange={() => toggleGroupSelection(group.id, true)}
                                  />
                                  <Label htmlFor={`group-${group.id}`} className="text-sm">
                                    {group.title}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={handleAddProfile}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Add Student
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Filter profiles by name or email..."
                        value={profileFilter}
                        onChange={(e) => setProfileFilter(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Student Email</TableHead>
                        <TableHead>Mother's Email</TableHead>
                        <TableHead>Father's Email</TableHead>
                        <TableHead>Number of Groups</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedProfiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">
                            {editingCell?.profileId === profile.id && editingCell?.field === "name" ? (
                              <Input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={saveEdit}
                                onKeyDown={handleKeyPress}
                                className="h-8"
                                autoFocus
                              />
                            ) : (
                              <span
                                className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                                onClick={() => startEditing(profile.id, "name", profile.name)}
                              >
                                {profile.name}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {editingCell?.profileId === profile.id && editingCell?.field === "email" ? (
                              <Input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={saveEdit}
                                onKeyDown={handleKeyPress}
                                className="h-8"
                                autoFocus
                              />
                            ) : (
                              <span
                                className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                                onClick={() => startEditing(profile.id, "email", profile.email)}
                              >
                                {profile.email}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {editingCell?.profileId === profile.id && editingCell?.field === "motherEmail" ? (
                              <Input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={saveEdit}
                                onKeyDown={handleKeyPress}
                                className="h-8"
                                autoFocus
                              />
                            ) : (
                              <span
                                className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                                onClick={() => startEditing(profile.id, "motherEmail", profile.motherEmail)}
                              >
                                {profile.motherEmail}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {editingCell?.profileId === profile.id && editingCell?.field === "fatherEmail" ? (
                              <Input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={saveEdit}
                                onKeyDown={handleKeyPress}
                                className="h-8"
                                autoFocus
                              />
                            ) : (
                              <span
                                className="cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                                onClick={() => startEditing(profile.id, "fatherEmail", profile.fatherEmail)}
                              >
                                {profile.fatherEmail}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="font-medium cursor-pointer hover:bg-primary/10 transition-colors"
                              onClick={() => openEditProfileGroupsDialog(profile)}
                            >
                              {profile.groups.length}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={profile.is_teacher ? "default" : "outline"}
                              size="sm"
                              className="font-medium h-6 px-2 text-xs"
                              onClick={() => {
                                toggleRole(profile.id)
                                toast.success("Role Updated",{
                                  description: `${profile.name} is now a ${!profile.is_teacher ? "Teacher" : "Student"}`,
                                })
                              }}
                            >
                              {profile.is_teacher ? "Teacher" : "Student"}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteProfile(profile.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {totalProfilesPages > 1 && (
                    <div className="flex items-center justify-between px-2 py-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {(profilesCurrentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(profilesCurrentPage * itemsPerPage, filteredProfiles.length)} of{" "}
                        {filteredProfiles.length} profiles
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProfilesCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={profilesCurrentPage === 1}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: totalProfilesPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={page === profilesCurrentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => setProfilesCurrentPage(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProfilesCurrentPage((prev) => Math.min(prev + 1, totalProfilesPages))}
                          disabled={profilesCurrentPage === totalProfilesPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Fullscreen Join Code Modal */}
      {fullscreenJoinCode && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full max-w-2xl mx-4">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground"
              onClick={closeFullscreenJoinCode}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Join code display */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-balance">{fullscreenJoinCode.title}</CardTitle>
                <CardDescription className="text-lg">Join Code</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="bg-primary/5 rounded-lg p-8 border border-primary/20">
                  <div className="text-6xl md:text-8xl font-mono font-bold text-primary tracking-wider">
                    {fullscreenJoinCode.code}
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => copyJoinCode(fullscreenJoinCode.code)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Copy Code
                  </Button>
                  <Button variant="outline" onClick={closeFullscreenJoinCode}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Edit Group Dialog */}
      <Dialog open={isEditGroupDialogOpen} onOpenChange={setIsEditGroupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>Update group properties and settings</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Group Title</Label>
              <Input
                id="edit-title"
                value={editGroup?.title || ""}
                onChange={(e) => setEditGroup((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                placeholder="e.g., Mathematics Year 10"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-joinCode">Join Code</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-joinCode"
                  value={editGroup?.joinCode || ""}
                  onChange={(e) =>
                    setEditGroup((prev) => (prev ? { ...prev, joinCode: e.target.value.toUpperCase() } : null))
                  }
                  placeholder="Enter or generate code"
                />
                <Button type="button" variant="outline" onClick={generateJoinCode}>
                  Generate
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGroupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateEditGroup} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Update Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student Profile</DialogTitle>
            <DialogDescription>Update student information and parent contact details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-profile-name">Student Name</Label>
              <Input
                id="edit-profile-name"
                value={editProfile?.name || ""}
                onChange={(e) => setEditProfile((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                placeholder="e.g., John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-profile-email">Student Email</Label>
              <Input
                id="edit-profile-email"
                type="email"
                value={editProfile?.email || ""}
                onChange={(e) => setEditProfile((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                placeholder="e.g., john.doe@school.edu"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-profile-motherEmail">Mother's Email</Label>
              <Input
                id="edit-profile-motherEmail"
                type="email"
                value={editProfile?.motherEmail || ""}
                onChange={(e) => setEditProfile((prev) => (prev ? { ...prev, motherEmail: e.target.value } : null))}
                placeholder="e.g., mother@email.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-profile-fatherEmail">Father's Email</Label>
              <Input
                id="edit-profile-fatherEmail"
                type="email"
                value={editProfile?.fatherEmail || ""}
                onChange={(e) => setEditProfile((prev) => (prev ? { ...prev, fatherEmail: e.target.value } : null))}
                placeholder="e.g., father@email.com"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-is_teacher"
                checked={editProfile?.is_teacher || false}
                onCheckedChange={(checked) =>
                  setEditProfile((prev) => (prev ? { ...prev, is_teacher: !!checked } : null))
                }
              />
              <Label htmlFor="edit-is_teacher" className="text-sm font-medium">
                This person is a teacher
              </Label>
            </div>
            <div className="grid gap-2">
              <Label>Select Groups</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-group-${group.id}`}
                      checked={editProfile?.groups.some((g) => g.id === group.id) || false}
                      onCheckedChange={() => toggleGroupSelection(group.id, false)}
                    />
                    <Label htmlFor={`edit-group-${group.id}`} className="text-sm">
                      {group.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProfileDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateEditProfile} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Update Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Groups Dialog */}
      <Dialog open={isEditProfileGroupsDialogOpen} onOpenChange={setIsEditProfileGroupsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Group Assignments</DialogTitle>
            <DialogDescription>Update group memberships for {editProfileGroups?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Filter groups..."
                value={groupsDialogFilter}
                onChange={(e) => setGroupsDialogFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid gap-2">
              <Label>Select Groups</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredGroupsForDialog.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`groups-edit-${group.id}`}
                      checked={editProfileGroups?.groups.some((g) => g.id === group.id) || false}
                      onCheckedChange={() => toggleGroupSelectionForGroupsEdit(group.id)}
                    />
                    <Label htmlFor={`groups-edit-${group.id}`} className="text-sm">
                      {group.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProfileGroupsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateProfileGroups} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Update Groups
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export { AdminDashboard }
