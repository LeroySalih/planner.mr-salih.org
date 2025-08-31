"use server"

import { getAssignments } from "./getAssignments";
import { Assignment, Assignments, AssignmentSchema, AssignmentsSchema } from "./types";

import { z} from "zod"
import { pool } from "@/lib/db";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        AssignmentSchema,
        AssignmentsSchema
    ]),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const deleteAssignment = async (prev: {data: any, error: any}, assignment: Assignment) => {
    
    //console.log("deleteCourse", prev, criteria);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            update assignments  
            set active=false
            where unit_id = $1 and group_id = $2
        `

        const result = await pool.query(query, [assignment.unit_id, assignment.group_id]);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows deleted ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = assignment;

    } catch(err) {
        if (err instanceof Error) {
            console.error(err.message);
            error = err.message;

            console.error(error);

            const {data:prevCourses, error: prevCoursesError} = await getAssignments();

            if (prevCoursesError){
                error = error + prevCoursesError
            }

            // assign the current courses to data so that the ui can refresh
            data = prevCourses
        }
    }
    finally {
        const retObj  = {data, error}
         //console.log("Server Returning", retObj);
        ReturnValSchema.parse(retObj);
       
        return retObj;
    }

    
};
