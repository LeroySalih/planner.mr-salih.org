"use client"

import { auth, currentUser } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";

import {getProfile} from "@/actions/profiles/getProfile";

import {DisplayProfile} from "./display-profile";

import { JoinClassForm } from "./join-class/join-class-code";
import { getMemberships } from "@/actions/groups-memberships/getMemberships";
import { DisplayGroups} from "./display-profile";

import { AppWindowIcon, CodeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {useState} from "react";
import { type Profile } from "@/actions/profiles/types";

const ProfileManager = ({user_id, initialProfile}: {user_id: string, initialProfile: Profile | null}) => {

    const [profile, setProfile] = useState<Profile | null>(initialProfile)

    const handleProfileChange = (newProfile: Profile | null) => {
        console.log("New Profile Recieved", newProfile);
        setProfile(newProfile);
    }

    return <Tabs defaultValue="groups" className="w-[400px]">
                <TabsList>
                <TabsTrigger value="groups">Groups</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>
                <TabsContent value="groups">
                    <JoinClassForm user_id={user_id} profile={profile} onProfileChange={handleProfileChange}/>
                    
                </TabsContent>
            
                <TabsContent value="profile">
                    {profile && <DisplayProfile initialProfile={profile} />}
                </TabsContent>
            </Tabs>
}

export default ProfileManager;