"use server"

import { pool } from "@/lib/db";
import { z } from "zod";
import { CriteriasSchema, type Criterias } from "./types";
const ReturnValSchema = z.object({
    data: CriteriasSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getCriteria = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            SELECT criteria_id, title, learning_objective_id, active, created, created_by, order_by
            FROM criteria
            WHERE active = true
        `
        const result = await pool.query(query);

        data =  (result.rows.map((row:any) => ({
            ...row,
            // if `row.created` is already a Date
            created: row.created.toISOString()
          })) || [] ) as Criterias;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getCriteria: returns", data, err)
            error = err.message;
        }

    } finally {
        ////console.log("getUnits: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        return result;
    }
}