import { Lesson, Lessons } from "@/actions/lessons/types"
import { LessonsAtom , CurrentDetailsObjectAtom} from "@/atoms"
import { Button } from "@/components/ui/button"
import { useAtom } from "jotai"
import { CirclePlus } from "lucide-react"
import { startTransition, useActionState, useEffect, useState } from "react"
import { toast } from "sonner"


import { deleteLesson } from "@/actions/lessons/deleteLesson";


const DeleteLessonBtn = ({lesson}:{lesson: Lesson, onDelete: ()=> void}) => {
  
  const [lessons, setLessons] = useAtom(LessonsAtom);
  const [stateLessons, deleteLessonFromDB, isLoading] = useActionState(deleteLesson, {data:null, error: null});
  const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);
  

  const handleDeleteLesson = () => {
    
    /* Delete a lesson from lessons*/
    setLessons(prev => prev.filter((l:Lesson) => l.lesson_id !== lesson.lesson_id));
    
    // update the server
    startTransition(()=>{
      deleteLessonFromDB(lesson!);
    })
     
    
  };

  useEffect(()=>{
    
    // ignore the forst load.
    if ((stateLessons.data === null && stateLessons.error === null))
      return;

    if (stateLessons.error){

      // return correct state in 
      setLessons(stateLessons.data as Lessons);

      toast.error(`Error!: ${stateLessons.error}`, {
      className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
    });
      return;
    } 
      
    toast.success("Update saved")
    setCurrentDetailsObject(null);
  },[stateLessons])
  
  
  return (
    <Button 
      variant="outline" 
       className="cursor-pointer text-red-400 border-red-400 hover:bg-red-400 hover:text-white" 
      
      onClick={handleDeleteLesson}>
      <CirclePlus size="18"/> Remove Lesson
    </Button>
  )
}

export default DeleteLessonBtn;