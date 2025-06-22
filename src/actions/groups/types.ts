import {z} from "zod";



export const GroupSchema = z.object({
  type: z.string().default("group"),
  group_id: z.string(),
  title: z.string().nullable().default(""),
  role: z.string().nullable().default(""),

  active: z.boolean(),
  created: z.coerce.date(), // accepts string or Date
  created_by: z.string(),
  order_by: z.number().nullable(),
});

export const GroupsSchema = z.array(GroupSchema);


export type Group = z.infer<typeof GroupSchema>;
export type Groups = z.infer<typeof GroupsSchema>;
