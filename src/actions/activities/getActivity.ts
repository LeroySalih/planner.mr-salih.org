"use server"

import { pool } from "@/lib/db";
import { z } from "zod";


import { Activity, ActivitySchema, type Activities } from "./types";

const ReturnValSchema = z.object({
    data: ActivitySchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getActivity = async (activityId: string): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            select * 
            from activities 
            where active = true and activity_id = $1
            order by order_by;
        `
        const result = await pool.query(query, [activityId]);

        data =  Object.assign({}, result.rows[0], {created: result.rows[0].created.toISOString()}) as Activity;
    
    } catch(err) {
        
        if (err instanceof Error){
            error = err.message;
            console.error("getActivity: returns", data, error)
            error = err.message;
        }

    } finally {
        //console.log("getActivity: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        return result;
    }
}