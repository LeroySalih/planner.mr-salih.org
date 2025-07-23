"use server"

import { getActivities } from "./getActivities";
import { Activity, ActivitySchema, ActivitiesSchema,Activities } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        ActivitySchema,
        ActivitiesSchema
    ]),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const updateActivity = async (prev: {data: any, error: any}, activity: Activity): Promise<ReturnVal> => {
    
    console.log("updateActivity", prev, activity);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            with updated as (
            update activities
            set BODY = $1,
                activity_type = $2,
                order_by = $3
            where activity_id = $4
            returning activity_id, title, lesson_id, activity_type, body, created_by, created,  active, order_by
                
            )
            SELECT updated.*
            from updated
            ;
        `
        console.log("query", query);

        // update DB 
        const result = await pool.query(query, [JSON.stringify(activity.body), activity.activity_type,  activity.order_by, activity.activity_id]);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = result.rows[0] as Activity;

    } catch(err) {
        if (err instanceof Error) {
            console.error("Error! updateActivities", err.message);
            error = err.message;

            const {data:prevCourses, error: prevCoursesError} = await getActivities();

            if (prevCoursesError){
                error = error + prevCoursesError
            }

            // assign the current courses to data so that the ui can refresh
            data = prevCourses
        }
    }
    finally {
         console.log("*** updateActivity Server Returning", {data, error});
        return ReturnValSchema.parse({data, error});
       
        
    }

    
};
