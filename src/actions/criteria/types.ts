import {z} from "zod";

export const CriteriaSchema = z.object({
    type: z.string().default("criteria"),
    criteria_id: z.string(),
    title: z.string(),
    learning_objective_id: z.string(),
    active: z.boolean(),
    created: z.coerce.date(),
    created_by: z.string(),
    order_by: z.number()
});


export const CriteriasSchema = z.array(CriteriaSchema);

export type Criteria = z.infer<typeof CriteriaSchema>;
export type Criterias = z.infer<typeof CriteriasSchema>;
