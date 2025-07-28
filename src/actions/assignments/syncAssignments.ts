"use server"

import { Assignment, Assignments, AssignmentSchema, AssignmentsSchema  } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";
import { getAssignments } from "./getAssignments";


const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        AssignmentSchema,
        AssignmentsSchema
    ]),
    error: z.string().nullable()
});



const runDBTxn = async (unitId: string, groupIds: string[]) => {

    const client = await pool.connect();

    let data = null, error= null;
    
    try {
        await client.query("BEGIN");

        // remove the existing LOLessonMaps for this lesson
        //console.log("Deleting", groupIds);

        // delete any assignments that are not in the groupIds
        await client.query(`
            DELETE FROM assignments
            WHERE unit_id = $1 and group_id  != ALL($2::uuid[])
            ;`, [unitId, groupIds]);    


        //console.log("runDBTxn","Deleted groups" );

        if (groupIds.length > 0) {   
        
            const query = `
                INSERT INTO assignments (group_id, unit_id)
              SELECT g, $1
              FROM unnest($2::uuid[]) AS g
              WHERE NOT EXISTS (
                SELECT 1 FROM assignments a
                WHERE a.group_id = g AND a.unit_id = $1);
            `;

            //console.log(query, [unitId, groupIds]);
            await client.query(query, [unitId, groupIds]);
            //console.log("runDBTxn","Added groups" );

        }

        await client.query("COMMIT");
    } catch (error) {
        console.error("runDBTxn", ((error as unknown) as Error).message)
        await client.query("ROLLBACK");
        throw error;  // Re-throw the error to be handled by the caller
    } finally {
        client.release();
    }
}


export const syncAssignments = async (
  _prev: { data: any; error: any },
  {unitId, groupIds}: {unitId: string, groupIds: string[]},
) => {

    //console.log("syncAssignments: Syncing groups", groupIds);

  const client = pool.connect();



  // ----------  run query & handle result -----------
  let data: any = null;
  let error: string | null = null;

  try {

    // run the update in a transaction
    await runDBTxn(unitId, groupIds);

    data = groupIds.map(groupId => ({
        type: "assignment",
        unit_id: unitId,
        group_id: groupId,
        created: new Date(),

    }));


    // fresh map rows for the UI
    
    //console.log("syncAssignments: Updated Assignments", data);
  } catch (e) {
    error = (e as Error).message;

    // fall back to current state so the UI can still render something
    const { data: prevMaps, error: prevErr } = await getAssignments();
    data = prevMaps;
    if (prevErr) error += ` • ${prevErr}`;
  } finally {
    //console.log("Returning::::", {data, error})
    //ReturnValSchema.parse({ data: "OK", error });
    return { data, error };
  }
};

