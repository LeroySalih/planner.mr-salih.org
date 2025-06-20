import { addCourse } from "@/actions/courses/addCourse"
import { Course, Courses } from "@/actions/courses/types"
import { CoursesAtom, CurrentCourseAtom, LessonsAtom, NCSAtom } from "@/atoms"
import { Button } from "@/components/ui/button"
import { useAtom } from "jotai"
import { ArrowBigUp, ReceiptRussianRuble } from "lucide-react"
import { startTransition, useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { updateLesson } from "@/actions/lessons/updateLesson" 
import { Lesson, Lessons } from "@/actions/lessons/types"

import { swapLessonOrder } from "@/actions/lessons/swapLessonOrder"

type MoveUpLessonButtonProps = {
  lesson: Lesson,
  disabled: boolean
}
const MoveUpLessonButton = ({lesson, disabled}:MoveUpLessonButtonProps) => {
  
  const [lessons, setLessons] = useAtom(LessonsAtom);
  const [dlgLesson, setDlgLesson] = useState<Lesson | null>(lesson || null);
  const [ncs, setNCs] = useAtom(NCSAtom);
  const [open, setOpen] = useState<boolean>(false);
  const [stateLessons, swapLessonOrderToDB, isLoading] = useActionState(swapLessonOrder, {data:null, error: null});

  const handleEditClick = () => {
    
    setOpen(true);
    // load the course from the current atom
    setDlgLesson({...dlgLesson!});
  };

  const handleSwap = () => {
    
   
    // update the client UI
    // call the server update

    //console.log("Editing Lesson", newLesson);
    
    /* Optinistic UI update */
    /* loop through prev, replace with new course from dlg */
    
    // calculate the to
    
    if (dlgLesson === null) {
      console.error("handleSwap: dlGLesson is null");
      return;
    }

    console.log("debug", lessons.filter(l => l.unit_id === dlgLesson.unit_id ));

    const temp_order = dlgLesson.order_by;

    // you need to filter to match lessons for this unit, then sort filter
    // again to get the next or previous lesson.
    let to:Lesson = lessons
                      .filter(l => l.unit_id === dlgLesson.unit_id)
                      .sort((a, b) => b.order_by - a.order_by)
                      .filter(l => l.order_by < dlgLesson.order_by)[0] || null;


    if (to === null || to === undefined){
      console.log("handleSwap - to is null or undefined", to);
      return;
    }

    if (dlgLesson === null)
      return;

    const from = {...dlgLesson, order_by: to!.order_by};
    to = {...to, order_by: temp_order}                  

    if (to === null || lessons == null || from === null){
      return;
    }

  
    // update the from and to
    setLessons((prev) => [...prev.map((l) => {
      if (l.lesson_id === from.lesson_id) return from;
      if (l.lesson_id === to.lesson_id) return to;
      return l;
      })]
  );
    
    
    // update the server
    startTransition(()=>{
      console.log(`Swapping ${from.title} to ${from.order_by} from ${to.order_by}`)
       swapLessonOrderToDB({from, to}!);
    })
    
    
    setOpen(false);
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
      
      
    // happy path. 
    /*   
    setCourses(prev => [
      ...prev.filter(c => c.course_id != (stateCourses.data as Course).course_id), // remove the optimistic added 
      (stateCourses.data as Course)].sort((a, b) => a.order_by! - b.order_by!)     // add the server returned
    );
    */

    toast.success("Update saved")
  
  },[stateLessons]);


  useEffect(()=>{
    setDlgLesson(lesson);
  },[lesson])
  
  
  return (<>
    
    <Button variant="ghost" onClick={handleSwap} disabled={disabled}>
      <ArrowBigUp size="22"/>
    </Button>
    
    </>
  )
}

export default MoveUpLessonButton;