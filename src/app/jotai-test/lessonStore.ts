// app/(client)/state/lessonStore.ts
"use client";

import type { Lesson } from "@/actions/lessons/types";
import { createResourceStoreAction } from "./resource-factory";
import { saveLessonOnServer } from "./server-lesson";


export const lessonStore = createResourceStoreAction<Lesson, string>({
  getKey: (l) => l.lesson_id,
  save: saveLessonOnServer,
  // Optional stronger merge:
  // merge: (prev, patch) => ({ ...prev, ...patch }),
});
