"use server"

import {  LessonsSchema, LessonSchema, Lesson } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";
import { getLessons } from "./getLessons";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        LessonSchema,
        LessonsSchema
    ]),
    error: z.string().nullable()
});




export const addLesson = async (prev: {data: any, error: any}, lesson: Lesson) => {
    
    console.log("addLesson", prev, lesson);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            with inserted as (
            insert into lessons (lesson_id,unit_id, title, tags, created_by)
            values ('${lesson.lesson_id}', '${lesson.unit_id}' , '${lesson.title}','${toPgArrayLiteral(lesson.tags)}','${lesson.created_by}')
            returning lesson_id, unit_id, title,  tags, created_by, created,  active, order_by
            )
            SELECT inserted.*
            from inserted; 
        `
        console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = result.rows[0];

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
         console.log("Server Returning", {data, error});
        ReturnValSchema.parse({data, error});
       
        return {data, error};
    }

    
};
