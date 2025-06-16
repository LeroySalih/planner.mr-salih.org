import {z} from "zod";

export const LessonSchema = z.object({
    type: z.string().default("lesson"),
    lesson_id: z.string(),
    title: z.string(),
    tags: z.array(z.string()),
    unit_id: z.string(),
    active: z.boolean(),
    created: z.coerce.date(),
    created_by: z.string(),
    order_by: z.number()
});


export const LessonsSchema = z.array(LessonSchema);

export type Lesson = z.infer<typeof LessonSchema>;
export type Lessons = z.infer<typeof LessonsSchema>;
