import {z} from "zod";

import { v4 as uuidv4 } from "uuid";

function generateRandomCode(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

export const GroupSchema = z.object({
    type: z.string().default("group"),
    group_id: z.string().default(() => uuidv4()),
    title: z.string().default("Not Set"),
    join_code: z.string().default(() => generateRandomCode()),
    member_count: z.number().default(0),
    active: z.boolean().default(true),
    created: z.coerce.date().default(() => new Date()),
    created_by: z.string().default("auto")
});

export const MemberSchema = z.object({
    user_id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    is_teacher: z.boolean(),
    active: z.boolean(),
});

export const MembershipSchema = z.object({
    type: z.string().default("membership"),
    group: GroupSchema,
    member: MemberSchema,
    member_count: z.number().default(0),
    role: z.string().default("pupil"), 
    active: z.boolean().default(true)
})

export const GroupsSchema = z.array(GroupSchema);
export const MembershipsSchema = z.array(MembershipSchema);

export type Group = z.infer<typeof GroupSchema>;
export type Groups = z.infer<typeof GroupsSchema>;

export type Membership = z.infer<typeof MembershipSchema>;
export type Memberships = z.infer<typeof MembershipsSchema>;