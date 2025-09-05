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
            select g.group_id, g.title, g.join_code, 
	        (select count(*) from group_membership gm where gm.group_id = g.group_id)::int as member_count,  
	        g.active, g.created, g.created_by, g.order_by
            from groups g
            where active = true
            order by g.title;
        `

        const result = await pool.query(query);

        data =  (result.rows.map((row:any) => ({
            ...row,
            
            // if `row.created` is already a Date
            created: row.created.toISOString()
          })) || [] ) as Groups;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getGroups: Error: " , error)
            error = err.message;
        }

        // send the reset data
        data = await getGroups();

    } finally {
        // console.log("getGroups: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        //console.log("getGroups", result);
        return result;
    }
}