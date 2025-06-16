"use server"

import { LOLessonMapSchema, LOLessonMap, LOLessonsMaps, LOLessonsMapsSchema } from "./types";
import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";
import { getLOLessonsMaps } from "./getLOLessonsMap";


const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        LOLessonMapSchema,
        LOLessonsMapsSchema
    ]),
    error: z.string().nullable()
});



const runDBTxn = async (lessonId: string, learningObjectiveIds: string[]) => {

    const client = await pool.connect();

    let data = null, error= null;
    
    try {
        await client.query("BEGIN");

        // remove the existing LOLessonMaps for this lesson
        console.log("Deleting", learningObjectiveIds);

        await client.query(`
            DELETE FROM learning_objective_lesson_map
            WHERE lesson_id = $1`, [lessonId]);    


        if (learningObjectiveIds.length > 0) {   
        
            const values:string[]= [];

            const placeholders = learningObjectiveIds.map((loId, i) => {
                values.push(lessonId, loId);
                return `($${i * 2 + 1}, $${i * 2 + 2})`;
                }).join(', ');

            const query = `
                INSERT INTO learning_objective_lesson_map (lesson_id, learning_objective_id)
                VALUES ${placeholders};
            `;

            console.log("Inserting LOLessonMaps", query, values);
                
            await client.query(query, values);
        }

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;  // Re-throw the error to be handled by the caller
    } finally {
        client.release();
    }
}


export const syncLOLessonMap = async (
  _prev: { data: any; error: any },
  {lessonId, loLessonMaps}: {lessonId: string, loLessonMaps: LOLessonMap[]},
) => {

    console.log("syncLOLessonMap: Syncing LOLessonsMaps", loLessonMaps);
    // ----------  build data & SQL -----------
  // const lessonIds = [...new Set(loLessonMaps.map(m => m.lesson_id))];   // dedup once

  // ❶ First param ($1) is the array of lesson IDs for the DELETE
  // ❷ Remaining params are the value-pairs for the INSERT
  const valuePlaceholders = loLessonMaps
    .map((_, i) => `($${i * 2 + 2}, $${i * 2 + 3})`)   // start at $2
    .join(", ");

  const params: any[] = [
    lessonId,                                          // $1
    ...loLessonMaps.flatMap(m => [m.learning_objective_id, m.lesson_id]),
  ];

  const client = pool.connect();



  // ----------  run query & handle result -----------
  let data: any = null;
  let error: string | null = null;

  try {

    // run the update in a transaction
    await runDBTxn(lessonId, loLessonMaps.map(m => m.learning_objective_id));

    data = loLessonMaps.map(m => ({
        type: "learning_objective_lesson_map",
        lesson_id: lessonId,
        learning_objective_id: m.learning_objective_id
    }));


    // fresh map rows for the UI
    
    console.log("syncLOLessonMap: Updated LOLessonsMaps", data);
  } catch (e) {
    error = (e as Error).message;

    // fall back to current state so the UI can still render something
    const { data: prevMaps, error: prevErr } = await getLOLessonsMaps();
    data = prevMaps;
    if (prevErr) error += ` • ${prevErr}`;
  } finally {
    ReturnValSchema.parse({ data, error });
    return { data, error };
  }
};

