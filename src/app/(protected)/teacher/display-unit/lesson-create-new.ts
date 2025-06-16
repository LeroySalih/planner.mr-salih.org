import { Course, Courses } from "@/actions/courses/types";
import { Lesson, Lessons, LessonSchema } from "@/actions/lessons/types";

const nextOrderBy = (lessons: Lessons) : number => {
    if (lessons.length == 0 || lessons === null)
      return 0;

    return (lessons.sort((a, b) => (b.order_by || 0) - (a.order_by || 0))[0].order_by || 0) + 1
}

export const createNewLesson = (unit_id: string, lessons: Lessons):Lesson => {
    return LessonSchema.parse({
      lesson_id: crypto.randomUUID(),
      unit_id,
      title: `New Lesson ${lessons.length}`,
      tags: [],
      active: true,
      created: new Date(),
      created_by: "auto",
      order_by: nextOrderBy(lessons)
    });
  }