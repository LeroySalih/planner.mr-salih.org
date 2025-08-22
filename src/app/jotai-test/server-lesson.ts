// app/actions/lessons.ts
"use server";

import { revalidateTag } from "next/cache";
import { Lesson } from "@/actions/lessons/types";
import { updateLesson } from "@/actions/lessons/updateLesson";

export async function saveLessonOnServer(next: Lesson)
  //: Promise<Lesson> 
  {
  // 1) validate input (zod) + write to DB
  // await db.updateLesson(next.lesson_id, next)
  // 2) revalidate SSR bits
  return await updateLesson({data: null, error: null}, next);

  revalidateTag(`lesson:${next.lesson_id}`);
  // 3) return canonical record
  return next; // or the row fetched from DB after update
}
