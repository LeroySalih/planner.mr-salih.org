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




export const addUnit = async (prev: {data: any, error: any}, unit: Unit) => {
    
    //console.log("addUnit", prev, unit);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

    try{
        /*
        const query = `
            with inserted as (
            insert into units (unit_id, title, course_id, tags, created_by)
            values ('${unit.unit_id}', '${unit.title}','${unit.course_id}','${toPgArrayLiteral(unit.tags)}','${unit.created_by}')
            returning unit_id, title, course_id, tags, created_by, created,  active, order_by
            )
            SELECT inserted.*, c.title as course_title, COALESCE(
                json_agg(
                json_build_object(
                    'lo_id',    lo.lo_id,
                    'lo_title', lo.title,
                    'lo_order', lo.order_by
                )
                ) FILTER (WHERE lo.lo_id IS NOT NULL),
                '[]'::json
            ) AS learning_objectives
            from inserted
            left join courses c on inserted.course_id = c.course_id
            left join learning_objectives lo on inserted.unit_id = lo.unit_id
            group by inserted.unit_id, inserted.title, inserted.course_id, inserted.tags, inserted.created_by, inserted.created, inserted.active, inserted.order_by, c.title;
        `*/

        const query = `WITH inserted AS (
    INSERT INTO units (unit_id, title, course_id, tags, created_by)
    VALUES (
        '${unit.unit_id}',
        '${unit.title}',
        '${unit.course_id}',
        '{}',
        'system'
    )
    RETURNING 
        unit_id,
        title,
        course_id,
        tags,
        created_by,
        created,
        active,
        order_by
)
SELECT 
    i.*,
    c.title AS course_title,
    COALESCE(
      (
        /* Correlated subquery to build a JSON array of learning_objectives */
        SELECT
          json_agg(
            json_build_object(
              'lo_id',    lo.learning_objective_id,
              'lo_title', lo.title,
              'lo_order', lo.order_by
            ) 
            ORDER BY lo.order_by
          )
        FROM learning_objectives AS lo
        WHERE lo.unit_id = i.unit_id
      ),
      '[]'::json
    ) AS learning_objectives
FROM inserted AS i
LEFT JOIN courses AS c
  ON i.course_id = c.course_id;

`

        //console.log("add unit query", query);

        const result = await pool.query(query);

        //console.log("add unit result", result.rows)

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
        });

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
