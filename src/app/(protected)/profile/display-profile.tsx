"use client"

import { useEffect, useState } from "react";
import { getProfile } from "@/actions/profiles/getProfile";
import { Profile } from "@/actions/profiles/types";
import EditLabel from "@/components/edit-label";


const DisplayProfile = ({userId}: {userId: string | null}) => {

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
        if (userId !== null) {

            loadProfile(userId);
        }
        
    }, [userId]);

    if (!profile) {
        return <p>Loading profile...</p>;
    }   

    return <div>
            <div className="flex flex-row gap-2">User Id: {profile?.user_id}</div>
            <div className="flex flex-row gap-2">First Name: <EditLabel initialTitle={profile?.first_name || ""} editClassName="" displayClassName="" onClick={()=>{}} onLabelChange={()=>{}}/></div>
            <div className="flex flex-row gap-2">Last Name:  <EditLabel initialTitle={profile?.last_name || ""} editClassName="" displayClassName="" onClick={()=>{}} onLabelChange={()=>{}}/></div>
            <div className="flex flex-row gap-2">Is Teacher:  <input type="checkbox" checked={profile?.is_teacher} onChange={()=>{}}/>    </div>
            
            <div>
                {profile.groups && profile.groups.length > 0 ? (
                    <div>
                        <h3>Groups</h3>
                        <ul>
                            {profile.groups.map((group) => (
                                <li key={group.group_id}>
                                    {group.title} - {group.role}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No groups found.</p>
                )}
            </div>
            
           
        </div>

}


export default DisplayProfile;