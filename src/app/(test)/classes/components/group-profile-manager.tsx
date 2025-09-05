"use client"

import { useState, useEffect, useActionState, startTransition } from "react";
import { toast } from "sonner"
import { AdminDashboard } from "./admin-dashboard"
import {  type Profile,  initialProfiles } from "../data/test-data"
import { type Groups, Group} from "@/actions/groups/types"
import { addGroup } from "@/actions/groups/addGroup";
import { deleteGroup } from "@/actions/groups/deleteGroup";
import { updateGroup } from "@/actions/groups/updateGroup";

import { error } from "console";

type DataChangeType = "create" | "edit" | "delete"

type DataChangeCallback<T> = (data: T, changeType: DataChangeType) => void

export default function GroupProfileManager({initialGroups} : {initialGroups: Groups}) {
  
  const [groups, setGroups] = useState<Groups>(initialGroups)
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles)

  const [createState, addGroupToDB, createPending] = useActionState(addGroup, {data: null, error: null});
  const [deleteState, deleteGroupFromDB, deletePending] = useActionState(deleteGroup, {data: null, error: null});
  const [updateState, updateGroupToDB, updatePending] = useActionState(updateGroup, {data: null, error: null});

  const handleGroupChange: DataChangeCallback<Group> = async  (group, changeType) => {
    console.log(`[v0] Group ${changeType} operation:`, group)

    switch (changeType) {
      case "create":

        console.log("Creating a new group: ", group);
        
        startTransition(()=>{
           addGroupToDB(group);
        });
        // update the UI
        setGroups((prev) => {
          const newGroups = [...prev, group]
          console.log(`[v0] Groups after create:`, newGroups.length)
          return newGroups
        });

        
        break
      case "edit":
        
        startTransition(()=>{
          updateGroupToDB(group);
        });
        
        // update UI
        setGroups((prev) => {
          const updatedGroups = prev.map((g) => (g.group_id === group.group_id ? group : g))
          console.log(`[v0] Group "${group.title}" updated`)
          return updatedGroups
        })
        
        break
      case "delete":

        // remove from UI
        setGroups((prev) => {
          const filteredGroups = prev.filter((g) => g.group_id !== group.group_id)
          console.log(`[v0] Groups after delete:`, filteredGroups.length)
          return filteredGroups
        });

        startTransition(()=>{
          deleteGroupFromDB(group);
        });
        
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

  useEffect(()=>{

    console.log("In USeEffect", createState);

    if ((createState.data === null && createState.error === null))
      return;

    const {data, error} = createState;

    if (error) {
      console.log("createGroup-useEffect", error);
      toast.error(error);
      
      // full set of groups from server;
      setGroups(data as Groups);

      return;
    }

    toast.success(
          "Success",{
          description: `Group "${(createState?.data as Group).title}" created successfully`,
        })



  }, [createState]);

  useEffect(()=>{

    console.log("In UseEffect", updateState);

    if ((updateState.data === null && updateState.error === null))
      return;

    const {data, error} = updateState;

    if (error) {
      console.log("updateGroup-useEffect", error);
      toast.error(error);
      
      // full set of groups from server;
      setGroups(data as Groups);

      return;
    }

    toast.success(
          "Success",{
          description: `Group "${(updateState?.data as Group).title}" updated successfully`,
        });

  }, [updateState]);

  useEffect(()=>{

    //console.log("In USeEffect", deleteState);

    if ((deleteState.data === null && deleteState.error === null))
      return;

    const {data, error} = deleteState;

    if (error) {
      console.log("deleteGroup-useEffect", error);
      toast.error(error);
      
      // full set of groups from server;
      setGroups(data as Groups);

      return;
    }

    toast.success(
          "Success",{
          description: `Group "${(deleteState?.data as Group).title}" deleted successfully`,
        })



  }, [deleteState])

  if (!groups) 
    return <div>Error! No groups</div>

  useEffect(()=>{
    setGroups(initialGroups);
  }, [initialGroups]);

  return (
    <AdminDashboard
      initialGroups={groups}
      profiles={profiles}
      onGroupChange={handleGroupChange}
      onProfileChange={handleProfileChange}
    />
  )
}

export { GroupProfileManager }
