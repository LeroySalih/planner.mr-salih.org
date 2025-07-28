"use server"

import {  CriteriasSchema, CriteriaSchema, Criteria, Criterias } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";
import { getCriteria } from "./getCriteria";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        CriteriaSchema,
        CriteriasSchema
    ]),
    error: z.string().nullable()
});




export const addCriteria = async (prev: {data: any, error: any}, criteria: Criteria) => {
    
    //console.log("addCriteria", prev, criteria);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            with inserted as (
            insert into criteria (criteria_id, learning_objective_id, title,  created_by)
            values ('${criteria.criteria_id}', '${criteria.learning_objective_id}' , '${criteria.title}','${criteria.created_by}')
            returning criteria_id, learning_objective_id, title,  created_by, created,  active, order_by
            )
            SELECT inserted.*
            from inserted; 
        `
        //console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = result.rows[0] as Criterias;

    } catch(err) {
        if (err instanceof Error) {
            console.error(err.message);
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
         //console.log("Server Returning", {data, error});
        ReturnValSchema.parse({data, error});
       
        return {data, error};
    }

    
};
