"use server";

import { getLearningObjectives } from "./getLearningObjectives";
import { LearningObjectivesSchema, LearningObjectives } from "./types";
import { z } from "zod";
import { pool } from "@/lib/db";


const ReturnValSchema = z.object({
  data: z.union([z.null(), LearningObjectivesSchema]),
  error: z.string().nullable(),
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;

/**
 * Update multiple units atomically.
 * - Validates input with Zod
 * - Uses a single UPDATE ... FROM (UNNEST(...)) statement
 * - Returns the updated units with course title + learning objectives aggregated
 */
export const updateLearningObjectives = async (
  prev: { data: any; error: any },
  LOs: LearningObjectives
): Promise<ReturnVal> => {
  let data: any = null;
  let error: string | null = null;

  try {
    const input = LearningObjectivesSchema.parse(LOs);

    if (input.length === 0) {
      return { data: [], error: null };
    }

    await pool.query("BEGIN");

    const loIds = input.map((lo) => lo.learning_objective_id);
    const titles = input.map((lo) => lo.title);
    const orders = input.map((lo) => lo.order_by);

    const query = `
      WITH payload AS (
        SELECT
          x.learning_objective_id::uuid   AS learning_objective_id,
          x.title::text     AS title,
          x.order_by::int   AS order_by
        FROM UNNEST($1::text[], $2::text[], $3::int[]) AS x(learning_objective_id, title, order_by)
      ),
      updated AS (
        UPDATE learning_objectives lo
        SET
          title    = p.title,
          order_by = p.order_by
        FROM payload p
        WHERE lo.learning_objective_id = p.learning_objective_id
        RETURNING lo.learning_objective_id, lo.title, lo.unit_id, lo.tags, lo.created_by, lo.created,  lo.active, lo.order_by
      )
    
      SELECT updated.*
      from updated;
    `;

    const result = await pool.query(query, [loIds, titles, orders]);

    if (result.rowCount !== input.length) {
      throw new Error(
        `Incorrect number of rows updated: expected ${input.length}, got ${result.rowCount}`
      );
    }

    const rows = result.rows as LearningObjectives;

    data = LearningObjectivesSchema.parse(rows);

    await pool.query("COMMIT");

  } catch (err) {
    await pool.query("ROLLBACK").catch(() => {});
    error = err instanceof Error ? err.message : "Unknown error";

    // Fallback: return current units so UI can refresh gracefully
    const { data: prevUnits, error: prevErr } = await getLearningObjectives();
    if (prevErr) error = `${error} ${prevErr}`;
    data = prevUnits;
  } finally {
    ReturnValSchema.parse({ data, error });
    return { data, error };
  }
};


