"use server"

import { pool } from "@/lib/db";

import { z } from "zod";



import { Units, UnitsSchema } from "./types";


const ReturnValSchema = z.object({
    data: UnitsSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getUnits = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            SELECT
  u.unit_id,
  u.title,
  u.course_id,
  c.title AS course_title,
  u.tags,
  u.active,
  u.created_by,
  u.created,
  u.order_by

FROM units u

LEFT JOIN courses c 
  ON u.course_id = c.course_id
WHERE u.active = true
GROUP BY u.unit_id, c.title

ORDER BY u.order_by;
        `
        const result = await pool.query(query);

        data =  (result.rows.map((row:any) => ({
            ...row,
            // if `row.created` is already a Date
            created: row.created.toISOString()
          })) || [] ) as Units;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getUnits: returns", data, err)
            error = err.message;
        }

    } finally {
        //console.log("getUnits: returns", data, error)
        const result = ReturnValSchema.parse({data, error});
        return result;
    }
}