"use server"

import { getUnits } from "./getUnits";
import { Unit, UnitSchema, UnitsSchema, Units } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        UnitSchema,
        UnitsSchema
    ]),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;




export const deleteUnit = async (prev: {data: any, error: any}, unit: Unit) => {
    
    //console.log("deleteUnit", prev, unit);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{

        const query = `
            with deleted as (

            update units 
            set active = false
            where unit_id='${unit.unit_id}'
            returning unit_id, title, course_id, tags, created_by, created,  active, order_by
            )
            SELECT deleted.*, c.title as course_title, COALESCE(
                json_agg(
                json_build_object(
                    'lo_id',    lo.learning_objective_id,
                    'lo_title', lo.title,
                    'lo_order', lo.order_by
                )
                ) FILTER (WHERE lo.learning_objective_id IS NOT NULL),
                '[]'::json
            ) AS learning_objectives
            from deleted
            left join courses c on deleted.course_id = c.course_id
            left join learning_objectives lo on deleted.unit_id = lo.unit_id
            group by deleted.unit_id, deleted.title, deleted.course_id, deleted.tags, deleted.created_by, deleted.created, deleted.active, deleted.order_by, c.title;
        `
        //console.log("delete unit query", query);

        const result = await pool.query(query);

        //console.log("delete unit result", result.rows)

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = UnitSchema.parse({
            unit_id: result.rows[0].course_id,
            title: result.rows[0].title, 
            course_id: result.rows[0].course_id,
            course_title: result.rows[0].course_title,
            learning_objectives: result.rows[0].learning_objectives,
            tags: result.rows[0].tags,
            created_by: result.rows[0].created_by,
            created: result.rows[0].created,
            active: result.rows[0].active,
            order_by: result.rows[0].order_by
        }) ;

    } catch(err) {
        if (err instanceof Error) {
            console.error("Error!", err.message);
            error = err.message;

            const {data:prevCourses, error: prevCoursesError} = await getUnits();

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
