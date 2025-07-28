"use server"

import { pool } from "@/lib/db";
import { z } from "zod";
import { LearningObjectivesSchema, type LearningObjectives } from "./types";
const ReturnValSchema = z.object({
    data: LearningObjectivesSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getLearningObjectives = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            select lo.learning_objective_id, lo.title, lo.tags, lo.unit_id, lo.active, lo.created, lo.created_by, lo.order_by 
            from learning_objectives lo
            where lo.active = true 
            order by lo.order_by;
        `
        const result = await pool.query(query);

        data =  (result.rows.map((row:any) => ({
            ...row,
            // if `row.created` is already a Date
            created: row.created.toISOString()
          })) || [] ) as LearningObjectives;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getLearningObjectives: returns", data, err)
            error = err.message;
        }

    } finally {
        ////console.log("getUnits: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        return result;
    }
}