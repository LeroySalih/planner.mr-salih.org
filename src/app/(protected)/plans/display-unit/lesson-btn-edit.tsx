import { LessonsAtom, NCSAtom } from "@/atoms"
import { Button } from "@/components/ui/button"
import { useAtom } from "jotai"
import { Pencil } from "lucide-react"
import { startTransition, useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { Lesson, Lessons } from "@/actions/lessons/types"
import { updateLesson } from "@/actions/lessons/updateLesson"


const EditLessonButton = ({lesson}:{lesson: Lesson | null}) => {
  
  const [lessons, setLessons] = useAtom(LessonsAtom);
  const [dlgLesson, setDlgLesson] = useState<Lesson | null>(lesson || null);
  const [ncs, setNCs] = useAtom(NCSAtom);
  const [open, setOpen] = useState<boolean>(false);
  const [stateLessons, updateLessonToDB, isLoading] = useActionState(updateLesson, {data:null, error: null});


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
      
      
    // happy path. 
    /*   
    setCourses(prev => [
      ...prev.filter(c => c.course_id != (stateCourses.data as Course).course_id), // remove the optimistic added 
      (stateCourses.data as Course)].sort((a, b) => a.order_by! - b.order_by!)     // add the server returned
    );
    */

    toast.success("Update saved")
  
  },[stateLessons]);
  
  const handleEditClick = () => {
    
    setOpen(true);
    // load the course from the current atom
    setDlgLesson({...dlgLesson!});
  };

  const handleSave = (newLesson: Lesson) => {
    
    if (newLesson === null || newLesson === undefined) {
      return;
    }
    // update the client UI
    // call the server update

    //console.log("Editing Lesson", newLesson);
    
    /* Optinistic UI update */
    /* loop through prev, replace with new course from dlg */
    setLessons((prev) => ([...prev.map((l:Lesson) => l.lesson_id === newLesson.lesson_id ? newLesson : l)]));
    
    // update the server
    startTransition(()=>{
       updateLessonToDB(newLesson!);
    })
    
    
    setOpen(false);
  };



  useEffect(()=>{
    setDlgLesson(lesson);
  },[lesson])
  
  
  return (
    
    <Button variant="ghost" onClick={handleEditClick} disabled={dlgLesson === null}>
      <Pencil size="18"/>
    </Button>
    
  )
}

export default EditLessonButton;