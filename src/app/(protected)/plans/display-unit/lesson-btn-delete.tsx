import { deleteLesson } from "@/actions/lessons/deleteLesson";
import { Course, Courses } from "@/actions/courses/types";
import { CoursesAtom, LessonsAtom } from "@/atoms";
import { useAtom, useAtomValue } from "jotai";
import { Trash2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Lesson, Lessons } from "@/actions/lessons/types";

const DeleteLessonButton = ({lesson}: {lesson: Lesson}) => {

    const [lessons, setLessons] = useAtom(LessonsAtom);
    const [state, deleteFromServer, isPending] = useActionState(deleteLesson, {data: null, error: null, timestamp: Date.now()});
    
    const handleClick = () => {

        if (isPending)
            return;

        // remove from UI
        // 

        // remove from DB
        startTransition( ()=>{
            deleteFromServer(lesson);
        });

    };

    useEffect(()=>{
       
        // ignore first load
        if (state.data === null && state.error === null)
            return;

        //console.log("useEffect::delete returned from server", state)
        // something went wrong
        if (state.error){
            toast.error(`Error! ${state.error}`)
            setLessons(state.data as Lessons);
            return;
        }

        // remove from the UI
        setLessons(prev => prev.filter(l => l.lesson_id !== lesson.lesson_id));
        toast.success('Lesson deleted');

    }, [state])

    return <div onClick={handleClick}>
        <Trash2 size="18" className={state.error ? "text-red-400" : ""}/>
    </div>
}

export default DeleteLessonButton;