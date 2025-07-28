"use server"

import { getLearningObjectives } from "./getLearningObjectives";
import { LearningObjective, LearningObjectiveSchema, LearningObjectivesSchema, LearningObjectives } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        LearningObjectiveSchema,
        LearningObjectivesSchema
    ]),
    error: z.string().nullable(),
    timestamp: z.number()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const deleteLearningObjective = async (prev: {data: any, error: any}, lo: LearningObjective) => {
    
    //console.log("deleteLearningObjective", prev, lo);

    let data = null;
    let error = null;

    try{

        const query = `
            update learning_objectives  
            set active=false
            where learning_objective_id = '${lo.learning_objective_id}'
        `
        //console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows deleted ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = lo;

    } catch(err) {
        if (err instanceof Error) {
            console.error(err.message);
            error = err.message;

            const {data:prevCourses, error: prevCoursesError} = await getLearningObjectives();

            if (prevCoursesError){
                error = error + prevCoursesError
            }

            // assign the current courses to data so that the ui can refresh
            data = prevCourses
        }
    }
    finally {
        const retObj  = {data, error, timestamp: Date.now()}
         //console.log("Server Returning", retObj);
        ReturnValSchema.parse(retObj);
       
        return retObj;
    }

    
};
