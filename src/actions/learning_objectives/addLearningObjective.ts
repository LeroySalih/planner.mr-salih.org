"use server"

import {  LearningObjectivesSchema, LearningObjectiveSchema, LearningObjective } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";
import { getLearningObjectives } from "./getLearningObjectives";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        LearningObjectiveSchema,
        LearningObjectivesSchema
    ]),
    error: z.string().nullable()
});




export const addLearningObjective = async (prev: {data: any, error: any}, learning_objective: LearningObjective) => {
    
    console.log("addLearningObjective", prev, learning_objective);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            with inserted as (
            insert into learning_objectives (learning_objective_id,unit_id, title, tags, created_by)
            values ('${learning_objective.learning_objective_id}', '${learning_objective.unit_id}' , '${learning_objective.title}','${toPgArrayLiteral(learning_objective.tags)}','${learning_objective.created_by}')
            returning learning_objective_id, unit_id, title,  tags, created_by, created,  active, order_by
            )
            SELECT inserted.*
            from inserted; 
        `
        console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = result.rows[0] as LearningObjective;

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
         console.log("Server Returning", {data, error});
        ReturnValSchema.parse({data, error});
       
        return {data, error};
    }

    
};
