"use server"

import { getCourses } from "./getCourses";
import { Course, CourseSchema, CoursesSchema, Courses } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        CourseSchema,
        CoursesSchema
    ]),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;




export const updateCourse = async (prev: {data: any, error: any}, course: Course): Promise<ReturnVal> => {
    
    //console.log("updateCourse", prev, course);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            with updated as (
            update courses
            set title = '${course.title}',
                nc_id = ${course.nc_id ? '' + course.nc_id + '\'' : 'null'},
                tags =  '${toPgArrayLiteral(course.tags)}'
            where course_id = '${course.course_id}'
            returning course_id, title, nc_id, tags, created_by, created,  active, order_by
                
            )
            SELECT updated.*, ncs.title as nc_title
            from updated
            left join ncs on updated.nc_id = ncs.nc_id;
        `
        //console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = {
            course_id: result.rows[0].course_id,
            title: result.rows[0].title, 
            nc_id: result.rows[0].nc_id,
            nc_title: result.rows[0].nc_title,
            tags: result.rows[0].tags,
            created_by: result.rows[0].created_by,
            created: result.rows[0].created,
            active: result.rows[0].active,
            order_by: result.rows[0].order_by
        };

    } catch(err) {
        if (err instanceof Error) {
            console.error("Error! updateCourses", err.message);
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
         //console.log("Server Returning", {data, error});
        return ReturnValSchema.parse({data, error});
       
        
    }

    
};
