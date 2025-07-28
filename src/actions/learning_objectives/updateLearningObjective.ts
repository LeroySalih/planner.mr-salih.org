"use server"



// TODO Update the learning objecive title edit!

import { getLearningObjectives } from "./getLearningObjectives";
import { LearningObjective, LearningObjectiveSchema, LearningObjectivesSchema, LearningObjectives } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        LearningObjectiveSchema,
        LearningObjectivesSchema
    ]),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;




export const updateLearningObjective = async (prev: {data: any, error: any}, lo: LearningObjective): Promise<ReturnVal> => {
    
    //console.log("updateLearningObjective", prev, lo);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            with updated as (
            update learning_objectives
            set title = '${lo.title}',
                unit_id = '${lo.unit_id}',
                tags =  '${toPgArrayLiteral(lo.tags)}'
            where learning_objective_id = '${lo.learning_objective_id}'
            returning learning_objective_id, title, unit_id, tags, created_by, created,  active, order_by
                
            )
            SELECT updated.*
            from updated;
        `
        //console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = result.rows[0] as LearningObjectives;

    } catch(err) {
        if (err instanceof Error) {
            console.error("Error! updateCourses", err.message);
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
         //console.log("Server Returning", {data, error});
        ReturnValSchema.parse({data, error});
       
        return {data, error};
    }

    
};
