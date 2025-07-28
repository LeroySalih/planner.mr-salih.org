"use server"

import { pool } from "@/lib/db";
import { z } from "zod";


import { GroupsSchema, type Groups } from "./types";

const ReturnValSchema = z.object({
    data: GroupsSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getGroups = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            select group_id, title, active, created, created_by, order_by
            from groups
            where active = true
            ;
        `
        const result = await pool.query(query);

        data =  (result.rows.map((row:any) => ({
            ...row,
            
            // if `row.created` is already a Date
            created: row.created.toISOString()
          })) || [] ) as Groups;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getGroups: returns", data, error)
            error = err.message;
        }

    } finally {
        ////console.log("getNCsByID: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        //console.log("getGroups", result);
        return result;
    }
}