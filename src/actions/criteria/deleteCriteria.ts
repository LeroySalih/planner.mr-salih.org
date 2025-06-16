"use server"

import { getCriteria } from "./getCriteria";
import { Criteria, CriteriaSchema, CriteriasSchema, Criterias } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        CriteriaSchema,
        CriteriasSchema
    ]),
    error: z.string().nullable(),
    timestamp: z.number()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const deleteCriteria = async (prev: {data: any, error: any}, criteria: Criteria) => {
    
    console.log("deleteCourse", prev, criteria);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            update criteria  
            set active=false
            where criteria_id = '${criteria.criteria_id}'
        `
        console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows deleted ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = criteria;

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
        const retObj  = {data, error, timestamp: Date.now()}
         console.log("Server Returning", retObj);
        ReturnValSchema.parse(retObj);
       
        return retObj;
    }

    
};
