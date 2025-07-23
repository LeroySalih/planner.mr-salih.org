"use server"

import { getActivities } from "./getActivities";
import { Activity, ActivitySchema, ActivitiesSchema, Activities } from "./types";
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




export const addActivity = async (prev: {data: any, error: any}, activity: Activity) => {
    
    console.log("addActivity", prev, activity);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

     const query = `
            with inserted as (
            insert into activities (lesson_id, title, activity_type, body)
            values ('${activity.lesson_id}', '${activity.title}','${activity.activity_type}','${JSON.stringify(activity.body)}')
            returning activity_id, lesson_id, title, activity_type, body, created_by, created,  active, order_by
            )
            SELECT inserted.*
            from inserted;
            `
    try{
        
        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = result.rows[0] as Activity;

    } catch(err) {
        if (err instanceof Error) {
            console.error(err.message, query);
            error = err.message;

            // get teh current couses so that the UI can refresh
            const {data:prevActivities, error: prevActivitiesError} = await getActivities();

            if (prevActivitiesError){
                error = error + prevActivitiesError
            }

            // assign the current courses to data so that the ui can refresh
            data = prevActivities
        }
    }
    finally {
        ReturnValSchema.parse({data, error});
        
        return {data, error};
    }
};
