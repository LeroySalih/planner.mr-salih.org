import { deleteCourse } from "@/actions/courses/deleteCourse";
import { Course, Courses } from "@/actions/courses/types";
import { deleteUnit } from "@/actions/units/deleteUnit";
import { Unit } from "@/actions/units/types";
import { CoursesAtom, CurrentDetailsObjectAtom, UnitsAtom } from "@/atoms";
import { Button } from "@/components/ui/button";
import { useAtom, useAtomValue } from "jotai";
import { Trash2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

const DeleteUnitButton = ({unit}: {unit: Unit}) => {

    const [courses, setCourses] = useAtom(CoursesAtom);
    const [units, setUnits] = useAtom(UnitsAtom);
    const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);

    const [state, deleteFromServer, isPending] = useActionState(deleteUnit, {data: null, error: null});
    
    const handleClick = () => {

        if (isPending)
            return;

        // remove from UI
        // 

        // remove from DB
        startTransition( ()=>{
            deleteFromServer(unit);
        });

    };

    useEffect(()=>{
        console.log("useEffect::delete state", state)
        // ignore first load
        if (state.data === null && state.error === null)
            return;

        console.log("useEffect::delete returned from server", state)
        // something went wrong
        if (state.error){
            toast.error(`Error! ${state.error}`)
            setCourses(state.data as Courses);
            return;
        }

        
        // show parent object
        setCurrentDetailsObject(courses.filter(c => c.course_id === unit.course_id)[0]);

        // remove from the UI
        setUnits(prev => prev.filter(u => u.unit_id !== unit.unit_id));
        toast.success('Unit deleted');

    }, [state])

    return <div >
        <Button onClick={handleClick} variant="outline" className="cursor-pointer text-red-400 border-red-400 hover:bg-red-400 hover:text-white">
            Remove Unit
            <Trash2 size="18" className={state.error ? "text-red-400" : ""}/>
        </Button>
    </div>
}

export default DeleteUnitButton;