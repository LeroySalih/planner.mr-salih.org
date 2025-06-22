
import {z} from "zod";


export const GroupSchema = z.object({
  type: z.string().default("group"),
  group_id: z.string(),
  title: z.string().nullable().default(""),
  role: z.string().nullable().default(""),

});

export const GroupsSchema = z.array(GroupSchema);

export const ProfileSchema = z.object({
  type: z.string().default("user"),
  user_id: z.string(),
  is_teacher: z.boolean(),
  first_name: z.string().nullable().default(""),
  last_name: z.string().nullable().default(""),
  groups: z.array(GroupSchema).default([]), // Array of groups, default to empty array
  active: z.boolean(),
  created: z.coerce.date(), // accepts string or Date
  created_by: z.string(),
  order_by: z.number().nullable(),
});

export const ProfilesSchema = z.array(ProfileSchema);

export type Profile = z.infer<typeof ProfileSchema>;
export type Profiles = z.infer<typeof ProfilesSchema>;
