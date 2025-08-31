import { deleteCourse } from "@/actions/courses/deleteCourse";
import { Course, Courses } from "@/actions/courses/types";
import { deleteCriteria } from "@/actions/criteria/deleteCriteria";
import { Criteria, Criterias } from "@/actions/criteria/types";
import { AssignmentsAtom, CoursesAtom, CriteriasAtom } from "@/atoms";
import { useAtom, useAtomValue } from "jotai";
import { Trash2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Assignment, Assignments, AssignmentSchema } from "@/actions/assignments/types";
import { deleteAssignment } from "@/actions/assignments/deleteAssignment";
import { useState} from "react";

type DeleteAssignmentButtonProps = {
    initial : Assignment
}
const DeleteAssignmentButton = ({initial}: DeleteAssignmentButtonProps) => {

    const [courses, setCourses] = useAtom(CoursesAtom);
    const [state, deleteFromServer, isPending] = useActionState(deleteAssignment, {data: null, error: null});
    const [criterias, setCriterias] = useAtom(CriteriasAtom);
    const [assignments, setAssignments] = useAtom(AssignmentsAtom);
    const [assignment, setAssignment] = useState(initial);

    useEffect(()=> {
        setAssignment(initial);
    }, [initial])


    const handleClick = () => {

        if (isPending)
            return;


        // remove from DB
        startTransition( ()=>{
            deleteFromServer(assignment);
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
            setAssignments(state.data as Assignments);
            return;
        }

        // remove from the UI
        const newAssignments = assignments.filter(a => a.unit_id !== assignment.unit_id && a.group_id !== assignment.group_id) 
        console.log("New Assignments", newAssignments);
        setAssignments(newAssignments);
        toast.success('Assignment deleted');

    }, [state])

    return <div onClick={handleClick}>
        <Trash2 size="18" className={state.error ? "text-red-400" : ""}/>
    </div>
}

export default DeleteAssignmentButton;