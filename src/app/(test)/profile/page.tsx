"use server"

import { auth, currentUser } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";

import {getProfile} from "@/actions/profiles/getProfile";


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

import ProfileManager from "./profile-manager";
import { createNewProfile } from "@/actions/profiles/createNewProfile";

const Page = async () => {

    const {userId} = await auth();
    const currentUserDetails = await currentUser();

    console.log("Current User", currentUserDetails?.firstName, currentUserDetails?.lastName, currentUserDetails?.emailAddresses[0]?.emailAddress);

    const {data: memberships, error: membershipError} = await getMemberships();

    if (membershipError) {
        return <pre>{JSON.stringify(membershipError, null, 2)}</pre>
    }

    if (userId === null) {
        return <div>Error!  User id is null. Please sign in.</div>
    }

    let {data: profile, error} = userId ? await getProfile(userId) : {data: null, error: null};
    
    // profile doesn't exist so create one.
    if (profile == null) {
        
        console.log("Profile not found, creating")
        const {data, error:createProfileError} = await createNewProfile(
            userId, 
            currentUserDetails?.firstName || "",  
            currentUserDetails?.lastName || "",
            currentUserDetails?.emailAddresses[0]?.emailAddress || ""
        );

        if (createProfileError) {
            return <div>Profile Create Errror {createProfileError}</div>
        }

        profile = data;
    }
    
    return <div className="min-h-screen bg-background. flex items-center  p-4 flex-col">
        <div className="text-4xl justify-left items-left">Profile</div>
        <div>
            
            <ProfileManager user_id={userId} initialProfile={profile} />
            
        </div>
        <div>
        
        
        
        

        
        </div>
    </div>
}

export default Page;