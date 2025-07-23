
import {z} from "zod";


export const ActivityTypeSchema = z.enum(["keywords", "text", "video", "images"]);

export const ActivitySchema = z.object({
  type: z.string().default("activity"),
  activity_id: z.string(),
  title: z.string(),
  lesson_id: z.string(),
  activity_type: ActivityTypeSchema,
  body: z.any(),

  active: z.boolean(),
  created: z.coerce.date(), // accepts string or Date
  created_by: z.string(),
  order_by: z.number(),
});

export const ActivitiesSchema = z.array(ActivitySchema);

export type ActivityType = z.infer<typeof ActivityTypeSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type Activities = z.infer<typeof ActivitiesSchema>;
