import { addCourse } from "@/actions/courses/addCourse"
import { Course, Courses } from "@/actions/courses/types"
import { CoursesAtom, CurrentCourseAtom, CurrentUnitAtom, LessonsAtom, NCSAtom, UnitsAtom } from "@/atoms"
import { Button } from "@/components/ui/button"
import { useAtom, useAtomValue } from "jotai"
import { CirclePlus } from "lucide-react"
import { startTransition, useActionState, useEffect, useState } from "react"
import { toast } from "sonner"


import { createNewLesson } from "./lesson-create-new"
import {  Lessons } from "@/actions/lessons/types"
import { addLesson } from "@/actions/lessons/addLesson"
import { Unit } from "@/actions/units/types"

const AddLessonBtn = ({unit}: {unit: Unit}) => {
  
  
  const [lessons, setLessons] = useAtom(LessonsAtom);
  
  const [stateLessons, addLessonToDB, isLoading] = useActionState(addLesson, {data:null, error: null});
  
  const units = useAtom(UnitsAtom);
  
  const handleSave = () => {
    
    // update the client UI
    // call the server update

    const newLesson = createNewLesson(unit!.unit_id, lessons!);
    
    //console.log("Adding lesson", newLesson);
    
    /* Add a New Course */
    setLessons(prev => [...prev, newLesson!]);
    //console.log("Lessons", lessons);

    // update the server
    startTransition(()=>{
      addLessonToDB(newLesson!);
    })
    
  };

  useEffect(()=>{
    
    // ignore the forst load.
    if ((stateLessons.data === null && stateLessons.error === null))
      return;

    if (stateLessons.error){

      console.error("addLessons Error", stateLessons.error, lessons);
      // return correct state in 
      setLessons(stateLessons.data as Lessons);

      toast.error(`Error!: ${stateLessons.error}`, {
        className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
      });

      return;
    } 
      
    toast.success("Update saved")
  
  },[stateLessons])
  
  
  return <Button variant="ghost" onClick={handleSave} className="text-neutral-600 hover:bg-white cursor-pointer hover:border-[0.5px] hover:border-slate-300 hover:shadow">
      Add Lesson
      <CirclePlus size="18"/>
    </Button>
    
  }

export default AddLessonBtn;