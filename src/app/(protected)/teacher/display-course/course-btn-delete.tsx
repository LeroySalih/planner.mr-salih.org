import { Course, Courses } from "@/actions/courses/types"
import { CoursesAtom, CurrentCourseAtom, CurrentDetailsObjectAtom, NCSAtom } from "@/atoms"
import { Button } from "@/components/ui/button"
import { useAtom } from "jotai"
import { CirclePlus } from "lucide-react"
import { startTransition, useActionState, useEffect, useState } from "react"
import { toast } from "sonner"


import { deleteCourse } from "@/actions/courses/deleteCourse"


const DeleteCourseBtn = ({course}:{course: Course, onDelete: ()=> void}) => {
  
  const [courses, setCourses] = useAtom(CoursesAtom);
  const [stateCourses, deleteCourseFromDB, isLoading] = useActionState(deleteCourse, {data:null, error: null});
  const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);
  

  const handleDeleteCourse = () => {
    
    
    
    /* Add a New Course to start of courses*/
    setCourses(prev => prev.filter((c:Course) => c.course_id !== course.course_id));
    
    // update the server
    startTransition(()=>{
      deleteCourseFromDB(course!);
    })
     
    
  };

  useEffect(()=>{
    
    // ignore the forst load.
    if ((stateCourses.data === null && stateCourses.error === null))
      return;

    if (stateCourses.error){

      // return correct state in 
      setCourses(stateCourses.data as Courses);

      toast.error(`Error!: ${stateCourses.error}`, {
      className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
    });
      return;
    } 
      
    toast.success("Update saved")
    setCurrentDetailsObject(null);
  },[stateCourses])
  
  
  return (
    <Button 
      variant="outline" 
       className="cursor-pointer text-red-400 border-red-400 hover:bg-red-400 hover:text-white" 
      
      onClick={handleDeleteCourse}>
      <CirclePlus size="18"/> Remove Course
    </Button>
  )
}

export default DeleteCourseBtn;