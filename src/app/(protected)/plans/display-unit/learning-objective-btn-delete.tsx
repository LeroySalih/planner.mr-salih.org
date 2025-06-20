import { deleteLesson } from "@/actions/lessons/deleteLesson";
import { Course, Courses } from "@/actions/courses/types";
import { CoursesAtom, LearningObjectivesAtom, LessonsAtom } from "@/atoms";
import { useAtom, useAtomValue } from "jotai";
import { Trash2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Lesson, Lessons } from "@/actions/lessons/types";
import { deleteLearningObjective } from "@/actions/learning_objectives/deleteLearningObjective";
import { LearningObjective, LearningObjectives } from "@/actions/learning_objectives/types";

type DeleteLearningObjectiveButton = {
    lo: LearningObjective
};

const DeleteLearningObjectiveButton = ({lo}: DeleteLearningObjectiveButton) => {

    const [learningObjectives, setLearningObjectives] = useAtom(LearningObjectivesAtom);
    const [state, deleteFromServer, isPending] = useActionState(deleteLearningObjective, {data: null, error: null, timestamp: Date.now()});
    
    const handleClick = () => {

        if (isPending)
            return;

        
        // remove from DB
        startTransition( ()=>{
            deleteFromServer(lo);
        });

    };

    useEffect(()=>{
       
        // ignore first load
        if (state.data === null && state.error === null)
            return;

        console.log("useEffect::delete returned from server", state)
        // something went wrong
        if (state.error){
            toast.error(`Error! ${state.error}`)
            //setLearningObjectives(state.data as LearningObjectives);
            return;
        }

        // remove from the UI
        setLearningObjectives(prev => prev.filter(pLO => lo.learning_objective_id !== pLO.learning_objective_id));
        toast.success('LO deleted');

    }, [state])

    return <div onClick={handleClick}>
        <Trash2 size="18" className={state.error ? "text-red-400" : ""}/>
    </div>
}

export default DeleteLearningObjectiveButton;