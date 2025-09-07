
import {z} from "zod";
import {Group, Groups, GroupSchema, GroupsSchema } from "../groups-memberships/types";


export const ProfileGroupSchema = GroupSchema.extend({
  role: z.string().default("pupil")
});

export const ProfileGroupsSchema = z.array(ProfileGroupSchema);

export const ProfileSchema = z.object({
  type: z.string().default("profile"),
  user_id: z.string(),
  is_teacher: z.boolean(),
  first_name: z.string().nullable().default(""),
  last_name: z.string().nullable().default(""),
  email: z.string().default("Not Provided"),
  father_email: z.string().default("Not Provided"),
  mother_email: z.string().default("Not Provided"),
  groups: ProfileGroupsSchema.default([]), // Array of groups, default to empty array
  active: z.boolean(),
  created: z.coerce.date(), // accepts string or Date
  created_by: z.string(),
  order_by: z.number().nullable(),
});

export const ProfilesSchema = z.array(ProfileSchema);


export type Profile = z.infer<typeof ProfileSchema>;
export type Profiles = z.infer<typeof ProfilesSchema>;
