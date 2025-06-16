
import { CirclePlus } from "lucide-react";
import { ChangeEventHandler, startTransition, useActionState, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Course } from "@/actions/courses/types";
import { Button } from "@/components/ui/button";
import { Unit, Units } from "@/actions/units/types";
import { useAtom } from "jotai";
import { UnitsAtom } from "@/atoms";
import { addUnit } from "@/actions/units/addUnit";
import { toast } from "sonner";

import { UnitSchema } from "@/actions/units/types";

const UnitBtnAdd = ({course}:{course:Course}) => {

    
    const createNewUnit = (course: Course) => {
        const newUnit = UnitSchema.parse({
            type: "unit",
            unit_id: crypto.randomUUID(),
            course_id: course.course_id,
            title: "New Unit",
            tags: [],
            active: true,
            created: new Date(),
            created_by: "system", // Replace with actual user ID if available
            order_by: 0,  // wont be passed on to DB to allow automatic trigger.
            learning_objectives: [],
        });

        console.log("Creating new unit", newUnit);
        return newUnit;
    };

    const [open, setOpen]= useState<boolean>(false);
    
    const [units, setUnits] = useAtom(UnitsAtom);
    const [unit, setUnit] = useState<Unit>(createNewUnit(course));

    const [state, addUnitToDB, isPending] = useActionState(addUnit, {data: null, error: null})
    
    const handleAddBtn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        
        const newUnit = createNewUnit(course);

        // add new unit to atoms
        setUnits(prev => [...prev, newUnit]);


        // add to db.
        startTransition(()=>{
            addUnitToDB(newUnit);
        });

        e.preventDefault();
    }

    
    const handleSave = () => {
        
        // add to atoms
        setUnits(prev => [...prev, unit]);

        // reset the new unit after being saved
        setUnit(createNewUnit(course))
        setOpen(false);
        
        // add to db.
        startTransition(()=>{
            addUnitToDB(unit);
        });
    }


    useEffect(()=>{

        // ignore the forst load.
        if ((state.data === null && state.error === null))
        return;

        if (state.error){
            console.log("Add Unit Error", state.error);
            // return correct state in 
            setUnits(state.data as Units);

            toast.error(`Error!: ${state.error}`, {
            className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
            });

      return;
    }
    
    toast("Unit Added");
    
    }, [state])

    return <>
        <Button variant={"outline"} className="ml-2" onClick={(e) => handleAddBtn(e)}>
                <CirclePlus size="16" className="mr-2cursor-pointer" />
                Add Unit
        </Button>
        </>
}

export default UnitBtnAdd;