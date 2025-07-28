"use server"

import { getCourses } from "./getCourses";
import { Course, CourseSchema, CoursesSchema, Courses } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        CourseSchema,
        CoursesSchema
    ]),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const deleteCourse = async (prev: {data: any, error: any}, course: Course) => {
    
    //console.log("deleteCourse", prev, course);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            update courses  
            set active=false
            where course_id = '${course.course_id}'
        `
        //console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows deleted ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = course;

    } catch(err) {
        if (err instanceof Error) {
            console.error(err.message);
            error = err.message;

            const {data:prevCourses, error: prevCoursesError} = await getCourses();

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
