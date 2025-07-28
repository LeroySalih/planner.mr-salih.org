import { addCourse } from "@/actions/courses/addCourse"
import { Course, Courses } from "@/actions/courses/types"
import { CoursesAtom, CurrentCourseAtom, NCSAtom } from "@/atoms"
import { Button } from "@/components/ui/button"
import { useAtom } from "jotai"
import { CirclePlus } from "lucide-react"
import { startTransition, useActionState, useEffect, useState } from "react"
import { toast } from "sonner"


import { createNewCourse } from "./course-create-new"

const AddCourseBtn = () => {
  
  const [courses, setCourses] = useAtom(CoursesAtom);
  const [dlgCourse, setDlgCourse] = useState<Course | null>(createNewCourse(courses) );
  const [ncs, setNCs] = useAtom(NCSAtom);
  const [open, setOpen] = useState<boolean>(false);
  const [stateCourses, addCourseToDB, isLoading] = useActionState(addCourse, {data:null, error: null});

  


  const handleAddCourse = () => {
    
    // update the client UI
    // call the server update

    const newCourse = createNewCourse(courses);
    
    //console.log("Adding Course", newCourse);
    
    /* Add a New Course to start of courses*/
    setCourses(prev => [newCourse, ...prev]);
    
    // update the server
    startTransition(()=>{
      addCourseToDB(newCourse!);
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
  
  },[stateCourses])
  
  
  return (
    <Button variant="outline" onClick={handleAddCourse}>
      <CirclePlus size="18"/> Add Course
    </Button>
  )
}

export default AddCourseBtn;