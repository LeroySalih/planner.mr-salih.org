import {z} from "zod";

export const LearningObjectiveSchema = z.object({
    type: z.string().default("learning_objective"),
    learning_objective_id: z.string(),
    title: z.string(),
    tags: z.array(z.string()),
    unit_id: z.string(),
    active: z.boolean(),
    created: z.coerce.date(),
    created_by: z.string(),
    order_by: z.number()
});

export const LearningObjectivesSchema = z.array(LearningObjectiveSchema);

export type LearningObjective = z.infer<typeof LearningObjectiveSchema>;
export type LearningObjectives = z.infer<typeof LearningObjectivesSchema>;
