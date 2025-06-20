"use client"

import { useEffect, useState } from "react";
import { getProfile } from "@/actions/profiles/getProfile";
import { Profile } from "@/actions/profiles/types";


const DisplayProfile = ({userId}: {userId: string}) => {

    const [profile, setProfile] = useState<Profile | null>(null);


    const loadProfile = async (user_id: string) => {
        
        const {data, error} = await getProfile(user_id);

        if (error) {
            console.error("Error loading profile:", error);
            return;
        }

        setProfile(data);

    }   

    useEffect(()=>{
        loadProfile(userId);
    }, [userId]);


    return <div>
            <p>User Id: {profile?.user_id}</p>
            <p>First Name: {profile?.first_name}</p>
            <p>Last Name: {profile?.last_name}</p>
            <p>Is Teacher: {profile?.is_teacher ? "Yes" : "No"}</p>
        </div>

}


export default DisplayProfile;