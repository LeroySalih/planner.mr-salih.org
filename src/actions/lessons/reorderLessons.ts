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


export const reorderLessons = async (prev: {data: any, error: any}, lessons: Lesson[]) => {
    
    //console.log("reorderLessons", prev, lessons);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        //console.log("reorderLessons: lessons", lessons.map(l => ({title: l.title,  order_by: l.order_by})));

        const ids = lessons.map(lesson => `'${lesson.lesson_id}'`).join(", ");
        const cases = lessons.map((lesson, index) => `WHEN '${lesson.lesson_id}' THEN ${lesson.order_by}`)
                            .join("\n  ");

        const query = `
            with updated as (
            UPDATE lessons
            SET order_by = CASE lesson_id
            ${cases}
            END
            WHERE lesson_id IN (${ids})
            returning lesson_id, unit_id, title,  tags, created_by, created,  active, order_by
            )
            SELECT updated.*
            from updated; 
        `

        //console.log("query", query);

        const result = await pool.query(query);

        if (result.rowCount == lessons.length){
        //   throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = result.rows;

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
         //console.log("Server Returning", {data, error});
        ReturnValSchema.parse({data, error});
       
        return {data, error};
    }

    
};
