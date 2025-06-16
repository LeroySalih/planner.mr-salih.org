"use server"

import { pool } from "@/lib/db";
import { z } from "zod";
import { LessonsSchema, type Lessons } from "./types";
const ReturnValSchema = z.object({
    data: LessonsSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getLessons = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            select l.lesson_id, l.title, l.tags, l.description, l.unit_id, l.active, l.created, l.created_by, l.order_by 
            from lessons l
            where l.active = true 
            order by l.created;
        `
        const result = await pool.query(query);

        data =  (result.rows.map((row:any) => ({
            ...row,
            // if `row.created` is already a Date
            created: row.created.toISOString()
          })) || [] ) as Lessons;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getLessons: returns", data, err)
            error = err.message;
        }

    } finally {
        //console.log("getUnits: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        return result;
    }
}