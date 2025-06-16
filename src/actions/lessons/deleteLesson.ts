"use server"

import { getLessons } from "./getLessons";
import { Lesson, LessonSchema, LessonsSchema,Lessons } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        LessonSchema,
        LessonsSchema
    ]),
    error: z.string().nullable(),
    timestamp: z.number()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const deleteLesson = async (prev: {data: any, error: any}, lesson: Lesson) => {
    
    console.log("deleteLesson", prev, lesson);

    let data = null;
    let error = null;

    try{

        const query = `
            update lessons  
            set active=false
            where lesson_id = '${lesson.lesson_id}'
        `
        console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows deleted ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = lesson;

    } catch(err) {
        if (err instanceof Error) {
            console.error(err.message);
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
        const retObj  = {data, error, timestamp: Date.now()}
         console.log("Server Returning", retObj);
        ReturnValSchema.parse(retObj);
       
        return retObj;
    }

    
};
