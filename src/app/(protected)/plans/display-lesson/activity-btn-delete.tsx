import { deleteActivity } from "@/actions/activities/deleteActivity";
import { Activities, Activity } from "@/actions/activities/types";
import { deleteCourse } from "@/actions/courses/deleteCourse";
import { Course, Courses } from "@/actions/courses/types";
import { deleteCriteria } from "@/actions/criteria/deleteCriteria";
import { Criteria, Criterias } from "@/actions/criteria/types";
import { ActivitiesAtom, CoursesAtom, CriteriasAtom } from "@/atoms";
import { useAtom, useAtomValue } from "jotai";
import { Trash2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";


type DeleteCourseButtonProps = {
    activity : Activity
}
const DeleteActivityButton = ({activity}: DeleteCourseButtonProps) => {

    const [activities, setActivities] = useAtom(ActivitiesAtom);
    const [state, deleteFromServer, isPending] = useActionState(deleteActivity, {data: null, error: null});
    
    const handleClick = () => {

        //console.log("Delete Acitvity Pressed")
        if (isPending)
            return;


        // remove from DB
        startTransition( ()=>{
            deleteFromServer(activity);
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
            setActivities(state.data as Activities);
            return;
        }

        // remove from the UI
        setActivities(prev => prev.filter(a => a.activity_id !== activity.activity_id));
        toast.success('Activity deleted');

    }, [state])

    return <div onClick={handleClick}>
        <Trash2 size="18" className={state.error ? "text-red-400" : ""}/>
    </div>
}

export default DeleteActivityButton;