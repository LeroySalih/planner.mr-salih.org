import { deleteCourse } from "@/actions/courses/deleteCourse";
import { Course, Courses } from "@/actions/courses/types";
import { deleteCriteria } from "@/actions/criteria/deleteCriteria";
import { Criteria, Criterias } from "@/actions/criteria/types";
import { CoursesAtom, CriteriasAtom } from "@/atoms";
import { useAtom, useAtomValue } from "jotai";
import { Trash2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";


type DeleteCourseButtonProps = {
    criteria : Criteria
}
const DeleteCriteriaButton = ({criteria}: DeleteCourseButtonProps) => {

    const [courses, setCourses] = useAtom(CoursesAtom);
    const [state, deleteFromServer, isPending] = useActionState(deleteCriteria, {data: null, error: null, timestamp: Date.now()});
    const [criterias, setCriterias] = useAtom(CriteriasAtom);

    const handleClick = () => {

        if (isPending)
            return;


        // remove from DB
        startTransition( ()=>{
            deleteFromServer(criteria);
        });

    };

    useEffect(()=>{
        //console.log("useEffect::delete state", state)
        // ignore first load
        if (state.data === null && state.error === null)
            return;

        //console.log("useEffect::delete returned from server", state)
        // something went wrong
        if (state.error){
            toast.error(`Error! ${state.error}`)
            setCriterias(state.data as Criterias);
            return;
        }

        // remove from the UI
        setCriterias(prev => prev.filter(c => c.criteria_id !== criteria.criteria_id));
        toast.success('Criteria deleted');

    }, [state])

    return <div onClick={handleClick}>
        <Trash2 size="18" className={state.error ? "text-red-400" : ""}/>
    </div>
}

export default DeleteCriteriaButton;