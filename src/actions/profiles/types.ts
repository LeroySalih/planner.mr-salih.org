
import {z} from "zod";

export const ProfileSchema = z.object({
  type: z.string().default("user"),
  user_id: z.string(),
  is_teacher: z.boolean(),

  active: z.boolean(),
  created: z.coerce.date(), // accepts string or Date
  created_by: z.string(),
  order_by: z.number().nullable(),
});

export const ProfilesSchema = z.array(ProfileSchema);

export type Profile = z.infer<typeof ProfileSchema>;
export type Profiles = z.infer<typeof ProfilesSchema>;
