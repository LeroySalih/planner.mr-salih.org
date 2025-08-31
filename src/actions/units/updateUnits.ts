"use server";

import { getUnits } from "./getUnits";
import { Unit, UnitSchema, UnitsSchema, Units } from "./types";
import { z } from "zod";
import { pool } from "@/lib/db";

const ReturnValSchema = z.object({
  data: z.union([z.null(), UnitSchema, UnitsSchema]),
  error: z.string().nullable(),
});
export type ReturnVal = z.infer<typeof ReturnValSchema>;

/**
 * Update multiple units atomically.
 * - Validates input with Zod
 * - Uses a single UPDATE ... FROM (UNNEST(...)) statement
 * - Returns the updated units with course title + learning objectives aggregated
 */
export const updateUnits = async (
  prev: { data: any; error: any },
  units: Units
): Promise<ReturnVal> => {
  let data: any = null;
  let error: string | null = null;

  try {
    const input = UnitsSchema.parse(units);
    if (input.length === 0) {
      return { data: [], error: null };
    }

    await pool.query("BEGIN");

    const unitIds = input.map((u) => u.unit_id);
    const titles = input.map((u) => u.title);
    const orders = input.map((u) => u.order_by);

    const query = `
      WITH payload AS (
        SELECT
          x.unit_id::uuid   AS unit_id,
          x.title::text     AS title,
          x.order_by::int   AS order_by
        FROM UNNEST($1::text[], $2::text[], $3::int[]) AS x(unit_id, title, order_by)
      ),
      updated AS (
        UPDATE units u
        SET
          title    = p.title, 
          order_by = p.order_by
        FROM payload p
        WHERE u.unit_id = p.unit_id
        RETURNING u.unit_id, u.title,u.description,  u.course_id, u.tags, u.created_by, u.created, u.active, u.order_by
      )
      SELECT
        u.unit_id,
        u.title,
        u.description, 
        u.course_id,
        c.title AS course_title,
        u.tags,
        u.created_by,
        u.created,
        u.active,
        u.order_by,
        COALESCE(
          json_agg(
            json_build_object(
              'lo_id',    lo.learning_objective_id,
              'lo_title', lo.title,
              'lo_order', lo.order_by
            )
          ) FILTER (WHERE lo.learning_objective_id IS NOT NULL),
          '[]'::json
        ) AS learning_objectives
      FROM updated u
      LEFT JOIN courses c ON u.course_id = c.course_id
      LEFT JOIN learning_objectives lo ON u.unit_id = lo.unit_id
      GROUP BY
        u.unit_id, u.title, u.description, u.course_id, u.tags, u.created_by, u.created, u.active, u.order_by, c.title;
    `;

    const result = await pool.query(query, [unitIds, titles, orders]);

    if (result.rowCount !== input.length) {
      throw new Error(
        `Incorrect number of rows updated: expected ${input.length}, got ${result.rowCount}`
      );
    }

    const rows = result.rows.map((r) => ({
      unit_id: r.unit_id,
      title: r.title,
      description: r.description,
      course_id: r.course_id,
      course_title: r.course_title,
      learning_objectives: r.learning_objectives,
      tags: r.tags,
      created_by: r.created_by,
      created: r.created,
      active: r.active,
      order_by: r.order_by,
    }));

    data = UnitsSchema.parse(rows);

    await pool.query("COMMIT");
  } catch (err) {
    await pool.query("ROLLBACK").catch(() => {});
    error = err instanceof Error ? err.message : "Unknown error";

    // Fallback: return current units so UI can refresh gracefully
    const { data: prevUnits, error: prevErr } = await getUnits();
    if (prevErr) error = `${error} ${prevErr}`;
    data = prevUnits;
  } finally {
    ReturnValSchema.parse({ data, error });
    return { data, error };
  }
};
