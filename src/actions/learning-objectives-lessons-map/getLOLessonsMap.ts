"use server"

import { pool } from "@/lib/db";
import { z } from "zod";
import { LOLessonsMapsSchema, type LOLessonsMaps } from "./types";

const ReturnValSchema = z.object({
    data: LOLessonsMapsSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getLOLessonsMaps = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        // only get lesson maps where the lesson is active.
        const query = `
            select lom.lesson_id, lom.learning_objective_id 
            from learning_objective_lesson_map lom
            left join lessons l on lom.lesson_id = l.lesson_id
            left join learning_objectives lo on lom.learning_objective_id = lo.learning_objective_id
            where lo.active = true and l.active = true
            ;
        `
        const result = await pool.query(query);

        data =  (result.rows || [] ) as LOLessonsMaps;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getLessons: returns", data, err)
            error = err.message;
        }

    } finally {
        ////console.log("getUnits: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        return result;
    }
}