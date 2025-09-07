"use server"


import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";
import { type Group, GroupSchema, MembershipSchema, type Membership} from "../groups-memberships/types";
import { type Profile, ProfileSchema} from "./types";
import { getProfile} from "./getProfile";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        ProfileSchema
    ]),
    error: z.string().nullable()
});


export const addMembership = async (prev: {data: any, error: any}, {profile, group}: {profile: Profile, group: Group}) => {
    
    ////console.log("addActivity", prev, activity);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

     const query = `
            with inserted as (
            insert into group_membership (user_id, group_id, role)
            values ($1, $2, 'pupil')
            returning user_id, group_id, role
            )
            SELECT inserted.*
            from inserted;
            `
    try{
        
        const result = await pool.query(query, [profile.user_id, group.group_id]);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // rebuild the profile with the new group
        const {data: newProfile, error: newProfileError} = await getProfile(profile.user_id);
        data = newProfile;

        console.log("data is", data);

    } catch(err) {
        if (err instanceof Error) {
            console.error(err.message, query);
            error = err.message;

            // get the current profile so that the UI can revert
            const {data:prevProfile, error: prevProfileError} = await getProfile(profile.user_id);

            if (prevProfileError){
                error = error + prevProfileError
             }

            // assign the current courses to data so that the ui can refresh
            data = prevProfile; //prevProfile
        }
    }
    finally {
        ReturnValSchema.parse({data, error});
        
        return {data, error};
    }
};
