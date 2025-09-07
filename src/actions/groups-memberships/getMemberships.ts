"use server"

import { pool } from "@/lib/db";
import { z } from "zod";


import { MembershipsSchema, type Membership } from "./types";

const ReturnValSchema = z.object({
    data: MembershipsSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getMemberships = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
        /* ToDo return profile and group obejcts for each membership row in JSON */
            SELECT
                to_jsonb(g)                    AS "group",
                to_jsonb(p) || jsonb_build_object('role', gm.role) AS "member",
                gm."role"  as role,
                gm.active  as active
                FROM group_membership gm
                JOIN groups   g ON g.group_id = gm.group_id
                JOIN profiles p ON p.user_id  = gm.user_id
                WHERE gm.active = true
                AND g.active  = true
                AND p.active  = true;
        `;

        const result = await pool.query(query);

        data =  result.rows;
    
    } catch(err) {
        
        if (err instanceof Error){
            error = err.message;
            console.error("getMembership: returns", data, error)
            error = err.message;
        }

    } finally {
        ////console.log("getActivities: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        return result;
    }
}