"use server"

import { getActivities } from "./getActivities";
import { Activity, ActivitySchema, ActivitiesSchema, Activities } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        ActivitySchema,
        ActivitiesSchema
    ]),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const deleteActivity = async (prev: {data: any, error: any}, activity: Activity) => {
    
    ////console.log("deleteActivity", prev, activity);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            update activities  
            set active=false
            where activity_id = $1;
        `
        ////console.log("query", query);

        const result = await pool.query(query, [activity.activity_id]);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows deleted ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = Object.assign({}, activity, {active: false});

    } catch(err) {
        if (err instanceof Error) {
            console.error(err.message);
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
        const retObj  = {data, error}
         ////console.log("Server Returning", retObj);
        ReturnValSchema.parse(retObj);
       
        return retObj;
    }

    
};
