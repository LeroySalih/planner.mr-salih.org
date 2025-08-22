// app/(client)/lesson/Editor.tsx
"use client";

import {startTransition} from "react";
import { Lesson } from "@/actions/lessons/types";
import { lessonStore } from "./lessonStore";

export function LessonEditor({ initial }: { initial: Lesson }) {
  const { value: lesson, setLocal, save, isPending, error } = lessonStore.useResource(initial);
  
  const handleSave: React.FormEventHandler<HTMLFormElement> = (e) => {

    e.preventDefault();

    startTransition(() => {
      void save({ title: lesson.title });
    });
  }
  
  return (
    <form
      onSubmit={handleSave}
    >
      <input
        value={lesson?.title || ""}
        onChange={(e) =>
          setLocal((curr) => ({ ...(curr as Lesson), title: e.target.value }))
        }
      />
      <button disabled={isPending}>Save</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
