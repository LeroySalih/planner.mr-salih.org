import {z} from "zod";

export const LOLessonMapSchema = z.object({
    type: z.string().default("learning_objective_lesson_map"),
    lesson_id: z.string(),
    learning_objective_id: z.string()
});


export const LOLessonsMapsSchema = z.array(LOLessonMapSchema);

export type LOLessonMap = z.infer<typeof LOLessonMapSchema>;
export type LOLessonsMaps = z.infer<typeof LOLessonsMapsSchema>;
