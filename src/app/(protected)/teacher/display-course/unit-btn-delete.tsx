import { deleteLesson } from "@/actions/lessons/deleteLesson";
import { Course, Courses } from "@/actions/courses/types";
import { CoursesAtom, LessonsAtom, UnitsAtom } from "@/atoms";
import { useAtom, useAtomValue } from "jotai";
import { Trash2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Lesson, Lessons } from "@/actions/lessons/types";
import { Unit, Units } from "@/actions/units/types";
import { deleteUnit } from "@/actions/units/deleteUnit";

const DeleteUnitButton = ({unit}: {unit: Unit}) => {

    const [lessons, setLessons] = useAtom(LessonsAtom);
    const [state, deleteFromServer, isPending] = useActionState(deleteUnit, {data: null, error: null});
    const [units, setUnits] = useAtom(UnitsAtom);

    const handleClick = () => {

        if (isPending)
            return;

    
        // remove from DB
        startTransition( ()=>{
            deleteFromServer(unit);
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
            setUnits(state.data as Units);
            return;
        }

        // remove from the UI
        setUnits(prev => prev.filter(u => u.unit_id !== unit.unit_id));
        toast.success('Unit deleted');

    }, [state]);

    return <div onClick={handleClick}>
        <Trash2 size="18" className={state.error ? "text-red-400" : ""}/>
    </div>
}

export default DeleteUnitButton;