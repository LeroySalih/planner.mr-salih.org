"use server"

import { pool } from "@/lib/db";
import { z } from "zod";


import { GroupSchema,  type Group } from "./types";

const ReturnValSchema = z.object({
    data: GroupSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getGroupByCode = async (prev: {data: any, error: any}, code: string): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            select g.group_id, g.title, g.join_code, 
	        (select count(*) from group_membership gm where gm.group_id = g.group_id)::int as member_count,  
	        g.active, g.created, g.created_by, g.order_by
            from groups g
            where active = true and join_code = $1
            order by g.title;
        `

        const result = await pool.query(query, [code]);

        if (result.rows.length != 1){
            throw new Error(`group not found with code ${code}`);
        }
        
        data =  Object.assign ({}, result.rows[0], {created: result.rows[0]?.created.toISOString()}) as Group;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getGroup: Error: " , error)
            error = err.message;
        }

        // send the reset data
        // data = await getGroups();

    } finally {
        // console.log("getGroups: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        //console.log("getGroups", result);
        return result;
    }
}