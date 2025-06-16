"use server"



// TODO Update the learning objecive title edit!

import { getCriteria } from "./getCriteria";
import { Criteria, CriteriaSchema, CriteriasSchema, Criterias } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        CriteriaSchema,
        CriteriasSchema
    ]),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;




export const updateCriteria = async (prev: {data: any, error: any}, c: Criteria): Promise<ReturnVal> => {
    
    console.log("updateCriteria", prev, c);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            with updated as (
            update criteria
            set title = '${c.title}'
            where criteria_id = '${c.criteria_id}'
            returning criteria_id, title, learning_objective_id, created_by, created,  active, order_by
                
            )
            SELECT updated.*
            from updated;
        `
        console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = result.rows[0] as Criterias;

    } catch(err) {
        if (err instanceof Error) {
            console.error("Error! updateCourses", err.message);
            error = err.message;

            const {data:prevCourses, error: prevCoursesError} = await getCriteria();

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
