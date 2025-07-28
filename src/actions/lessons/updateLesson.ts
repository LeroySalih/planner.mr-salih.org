"use server"

import { getLessons } from "./getLessons";
import { Lesson, LessonSchema, LessonsSchema, Lessons } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        LessonSchema,
        LessonsSchema
    ]),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;




export const updateLesson = async (prev: {data: any, error: any}, lesson: Lesson): Promise<ReturnVal> => {
    
    //console.log("updateLesson", prev, lesson);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            with updated as (
            update lessons
            set title = '${lesson.title}',
                unit_id = '${lesson.unit_id}',
                tags =  '${toPgArrayLiteral(lesson.tags)}'
            where lesson_id = '${lesson.lesson_id}'
            returning lesson_id, title, unit_id, tags, created_by, created,  active, order_by
                
            )
            SELECT updated.*
            from updated;
        `
        //console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = result.rows[0] as Lesson;

    } catch(err) {
        if (err instanceof Error) {
            console.error("Error! updateCourses", err.message);
            error = err.message;

            const {data:prevCourses, error: prevCoursesError} = await getLessons();

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
