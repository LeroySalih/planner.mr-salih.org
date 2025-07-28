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




export const addCourse = async (prev: {data: any, error: any}, course: Course) => {
    
    //console.log("addCourse", prev, course);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            with inserted as (
            insert into courses (course_id, title,  tags, created_by)
            values ('${course.course_id}', '${course.title}','${toPgArrayLiteral(course.tags)}','${course.created_by}')
            returning course_id, title, nc_id, tags, created_by, created,  active, order_by
            )
            SELECT inserted.*, ncs.title as nc_title
            from inserted
            left join ncs on inserted.nc_id = ncs.nc_id;
        `
        
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
            console.error(err.message);
            error = err.message;

            // get teh current couses so that the UI can refresh
            const {data:prevCourses, error: prevCoursesError} = await getCourses();

            if (prevCoursesError){
                error = error + prevCoursesError
            }

            // assign the current courses to data so that the ui can refresh
            data = prevCourses
        }
    }
    finally {
        ReturnValSchema.parse({data, error});
        
        return {data, error};
    }

    
};
