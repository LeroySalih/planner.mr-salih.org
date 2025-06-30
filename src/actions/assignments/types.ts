
import {z} from "zod";

export const AssignmentSchema = z.object({
  type: z.string().default("assignment"),
  unit_id: z.string(),
  group_id: z.string(),
  unit_title: z.string(),
  group_title: z.string(),

  active: z.boolean(),
  created: z.coerce.date(), // accepts string or Date
  // created_by: z.string(),
 //s order_by: z.number().nullable(),
});

export const AssignmentsSchema = z.array(AssignmentSchema);

export type Assignment = z.infer<typeof AssignmentSchema>;
export type Assignments = z.infer<typeof AssignmentsSchema>;
