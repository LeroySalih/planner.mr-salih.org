"use client"

import type React from "react"

import { useActionState, useState, useEffect, startTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { getGroupByCode } from "@/actions/groups-memberships/getGroupByCode";
import { setErrorMap } from "zod"
import { DisplayGroups }from "../display-profile";
import { type Profile, ProfileGroupSchema } from "@/actions/profiles/types";
import { addMembership } from "@/actions/profiles/addGroupToProfile";
import { Membership,Group, Groups, GroupSchema } from "@/actions/groups-memberships/types"


export function JoinClassForm({
    user_id, 
    profile: initialProfile,
    onProfileChange
    
    }: {user_id: string, profile: Profile | null, onProfileChange: (newProfile: Profile | null) => void
    
    }) {
  
  const [classCode, setClassCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [getState, getGroupByCodefromDb, getGroupPending] = useActionState(getGroupByCode, {data: null, error: null})
  const [profile, setProfile] = useState<Profile | null>(initialProfile)

  // todo add membership
  
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const [group, setGroup] = useState<Group | null>(null);

  const [addState, addMembershipGroupOnDb, addMembershipPending] = useActionState(addMembership, {data: null, error: null});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 5)

    setClassCode(value);

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (classCode.length !== 5) {
      toast.error("Invalid Code",{
        description: "Please enter a complete 5-character class code.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call - replace with actual implementation
      
      startTransition(()=>{
        profile && group && addMembershipGroupOnDb({profile, group});
      })

      // Reset form
      setClassCode("")
    } catch (error) {
      toast.error("Failed to join class. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  const addGroupToProfile = (profile: Profile, newGroup: Group) => {
    
    const newGroups = profile.groups.push(ProfileGroupSchema.parse({...newGroup}));

    return Object.assign({}, profile, {groups: newGroups});
    
  }

  useEffect(()=>{
    setProfile(initialProfile);
  }, [initialProfile])

  useEffect(()=>{
    
    console.log("In useEffect for addState", addState);
    
    // ignore the initial
    if (addState.data == null && addState.error == null) {
      return;
    }

    if (addState.error) {
      toast.error(addState.error);
      setProfile(addState.data);
      return;
    }

    // update UI
    setProfile(addState.data);
    onProfileChange(addState.data);

  }, [addState]);

  useEffect(()=>{

    setStatus("");
    setCanSubmit(false);
    setGroup(null);

    if (classCode.length == 5) {

        startTransition(() =>{
            // 
            getGroupByCodefromDb(classCode);
        })
    } 

  },[classCode]);


  useEffect(()=>{
    
    if (getState.error){
        setGroup(null);
        setStatus(`An error occured.  ${getState.error}`);
        return;
    }

    if (getState.data == null){
       setGroup(null);
       setStatus(`Class with code ${classCode} is not found`);
       return;
    }

    if (getState.data){
        setGroup(getState.data);
        setStatus(`Joining class ${getState.data.title}`);
        setCanSubmit(true);

        //toast.success("Added user to group");
    }



  },[getState])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Class Code Entry</CardTitle>
        <CardDescription>Enter the 5-character code provided by your teacher</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="classCode" className="text-sm font-medium text-foreground">
              Class Code
            </label>
            <Input
              id="classCode"
              type="text"
              value={classCode}
              onChange={handleInputChange}
              placeholder="ABC12"
              className="text-center text-lg font-mono tracking-widest uppercase"
              maxLength={5}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">{classCode.length}/5 characters</p>
          </div>

          {getGroupPending && <div className="text-xs text-muted-foreground">Checking</div>}
          <div className="text-xs text-muted-foreground">{status}</div>

          <Button type="submit" className="w-full" disabled={!canSubmit || isLoading}>
            {isLoading ? "Joining..." : "Join Class"}
          </Button>

          {profile && <DisplayGroups profile={profile} />}
        
        </form>
      </CardContent>
    </Card>
  )
}
