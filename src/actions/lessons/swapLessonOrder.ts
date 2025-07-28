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




export const swapLessonOrder = async (prev: {data: any, error: any}, {from, to}: {from: Lesson, to: Lesson}): Promise<ReturnVal> => {
    
    //console.log("swapLessonOrder", prev, from, to);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        // Swap order_by's
        // assuming that the swap of order has happened.
        const query = `
            BEGIN;
            
            --${from.title}
            update lessons
            set order_by = ${from.order_by}
            where lesson_id = '${from.lesson_id}';

            --${to.title}
            update lessons
            set order_by = ${to.order_by}
            where lesson_id = '${to.lesson_id}';

            COMMIT;
        `

        //console.log("query", query);

        const result = await pool.query(query);

        //console.log("Rows", result.rows)

        // only return courses if there is an issue.
        data = null;

    } catch(err) {
        if (err instanceof Error) {
            console.error("Error! swapLessonOrder", err.message);
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
