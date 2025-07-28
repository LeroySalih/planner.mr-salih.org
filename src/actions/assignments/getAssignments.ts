"use server"

import { pool } from "@/lib/db";
import { z } from "zod";


import { AssignmentsSchema, type Assignments } from "./types";

const ReturnValSchema = z.object({
    data: AssignmentsSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getAssignments = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            select a.*, u.title as unit_title, g.title as group_title   
            from assignments a
            left join units u on a.unit_id = u.unit_id 
            left join groups g on a.group_id  = g.group_id
            where a.active = true
            order by g.title
            ;
        `
        const result = await pool.query(query);

        data =  (result.rows.map((row:any) => ({
            ...row,
            //assignment_from: row.assignment_from !== null ? row.assignment_from?.toISOString() : null,

            // if `row.created` is already a Date
            created: row.created.toISOString()
          })) || [] ) as Assignments;
    
    } catch(err) {
        
        if (err instanceof Error){
            error = err.message;
            console.error("getAssignments: returns", data, error)
            error = err.message;
        }

    } finally {
        ////console.log("getNCsByID: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        //console.log("** getAssignments **", result);
        return result;
    }
}