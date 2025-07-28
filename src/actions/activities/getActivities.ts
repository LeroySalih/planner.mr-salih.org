"use server"

import { pool } from "@/lib/db";
import { z } from "zod";


import { ActivitiesSchema, type Activities } from "./types";

const ReturnValSchema = z.object({
    data: ActivitiesSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getActivities = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            select * 
            from activities 
            where active = true
            order by order_by;
        `
        const result = await pool.query(query);

        data =  (result.rows.map((row:any) => ({
            ...row,
            //assignment_from: row.assignment_from !== null ? row.assignment_from?.toISOString() : null,

            // if `row.created` is already a Date
            created: row.created.toISOString()
          })) || [] ) as Activities;
    
    } catch(err) {
        
        if (err instanceof Error){
            error = err.message;
            console.error("getActivities: returns", data, error)
            error = err.message;
        }

    } finally {
        ////console.log("getActivities: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        return result;
    }
}