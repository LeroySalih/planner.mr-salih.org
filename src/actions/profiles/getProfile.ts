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
            select user_id, is_teacher, active, created, created_by, order_by
            from profiles
            where user_id = $1
        `
        const result = await pool.query(query, [user_id]);

        data =  (result.rows.map((row:any) => ({
            ...row,
            // if `row.created` is already a Date
            created: row.created.toISOString()
          }))[0] ) as Profile;
    
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