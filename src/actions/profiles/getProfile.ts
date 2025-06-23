"use server"

import { pool } from "@/lib/db";
import { z } from "zod";


import { ProfileSchema, type Profile } from "./types";

const ReturnValSchema = z.object({
    data: ProfileSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getProfile = async (user_id: string): Promise<ReturnVal> => {

    let data = null, error = null;

    console.log("getProfile: user_id", user_id);
    
    try{
        const query = `
            SELECT 
    p.user_id,
    p.first_name,
    p.last_name,
    p.is_teacher,
    p.created,
    p.active,
    p.created_by,
    p.order_by,
    COALESCE(
        json_agg(
            jsonb_build_object(
                'group_id', g.group_id,
                'title', g.title,
                'role', gm.role
            )
        ) FILTER (WHERE g.group_id IS NOT NULL),
        '[]'::json
    ) AS groups
FROM profiles p
LEFT JOIN group_membership gm 
    ON p.user_id = gm.user_id AND gm.active = true
LEFT JOIN groups g 
    ON gm.group_id = g.group_id AND g.active = true
WHERE p.user_id = $1 -- replace with your user id or use a parameter
GROUP BY p.user_id, p.first_name, p.last_name;
        `
        const result = await pool.query(query, [user_id]);

        data =  (result.rows.map((row:any) => ({
            ...row,
            // if `row.created` is already a Date
            created: row.created.toISOString()
          }))[0] || null) as Profile;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getProfile: returns", data, error)
            error = err.message;
        }

    } finally {
        console.log("getProfile: returns", data, error)
        
        const result = ReturnValSchema.parse({data, error});
        console.log("Result", result);
        return result;
    }
}