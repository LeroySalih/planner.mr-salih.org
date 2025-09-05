import {z} from "zod";
import { v4 as uuidv4 } from "uuid";


function randomJoinCode(length = 5) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export const GroupSchema = z.object({
  type: z.string().default("group"),
  group_id: z.string().default(uuidv4()),
  title: z.string().nullable().default(""),
  join_code: z.string().nullable().default(()=> randomJoinCode()),
  member_count: z.number().default(0),

  active: z.boolean().default(true),
  created: z.coerce.date().default(()=> new Date()), // accepts string or Date
  created_by: z.string().default("auto"),
  order_by: z.number().nullable().default(0),
});

export const GroupsSchema = z.array(GroupSchema);


export type Group = z.infer<typeof GroupSchema>;
export type Groups = z.infer<typeof GroupsSchema>;
