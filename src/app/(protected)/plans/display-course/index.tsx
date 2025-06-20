'use client';

import { Lesson } from '@/actions/lessons/types';
import { ReactNode, startTransition, useActionState, useEffect, useState } from 'react';
import { NotebookText} from 'lucide-react';
import { LOLessonsMaps } from '@/actions/learning-objectives-lessons-map/types';
import { CoursesAtom, CriteriasAtom, CurrentDetailsObjectAtom, LearningObjectivesAtom, LessonsAtom, LOLessonsMapsAtom, UnitsAtom } from '@/atoms';
import { useAtom } from 'jotai';
import { LearningObjective, LearningObjectives } from '@/actions/learning_objectives/types';
import { Unit, Units } from '@/actions/units/types';
import { Book } from 'lucide-react';
import { Course, Courses } from '@/actions/courses/types';
import EditLabel from '@/components/edit-label';
import { updateCourse } from '@/actions/courses/updateCourse';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DeleteCourseBtn from './course-btn-delete';
import AddUnitBtn from "./unit-btn-add";
import { updateUnit } from '@/actions/units/updateUnit';
import DeleteUnitButton from './unit-btn-delete';

interface DisplayCourseProps {
    course: Course
}   
  // Define any props you need here, for example:}

const DisplayCourse = () => {

    const [loLesonsMaps, setLOLessonsMaps] = useAtom<LOLessonsMaps>(LOLessonsMapsAtom);
    const [learningObjectives, setLearningObjectives] = useAtom<LearningObjectives | null>(LearningObjectivesAtom);
    const [criterias, setCriteria] = useAtom(CriteriasAtom);  
    const [courses, setCourses] = useAtom(CoursesAtom);
    const [lessons, setLessons] = useAtom(LessonsAtom);
    const [units, setUnits] = useAtom(UnitsAtom);
    const [stateCourses, updateCourseToDB, isLoading] = useActionState(updateCourse, {data:null, error: null});
    
    const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);
    const  [course, setCourse] = useState<null | Course>(null);
    
    useEffect(()=>{
      console.log("Display-Course - New Object Detected", currentDetailsObject)
      setCourse(currentDetailsObject as Course)
    },[currentDetailsObject]);
  
    const handleLabelChange = (newTitle: string) => {
        
      // Optimistic Update UI
        const updatedCourse = { ...course, title: newTitle } as Course;
        // Update the course title in the UI
        setCourses(prev =>
            prev.map(c => c?.course_id === course?.course_id ? updatedCourse : c)
        );

        // update the server
        startTransition(()=>{
            updateCourseToDB(updatedCourse!);
        });

      }

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
      
      
    // happy path. 
    /*   
    setCourses(prev => [
      ...prev.filter(c => c.course_id != (stateCourses.data as Course).course_id), // remove the optimistic added 
      (stateCourses.data as Course)].sort((a, b) => a.order_by! - b.order_by!)     // add the server returned
    );
    */

    toast.success("Update saved")
  
      },[stateCourses]);

    return (
        <div className="h-full">
  <div className='flex flex-row items-center text-3xl font-bold mt-8 border-b-2 border-gray-200 pb-4 mb-4'>
    <Book className="w-6 h-6 text-blue-500 mr-2" />
    {course && <EditLabel initialTitle={course?.title} onLabelChange={handleLabelChange} onClick={()=>{}} />}
  </div>
  <div>
    {course && <DeleteCourseBtn course={course} onDelete={()=>{}}/>}
      
  </div>

  <div className="mt-8 font-semibold text-2xl w-full border-b-[0.5px] border-gray-200 flex flex-col  pb-2">
    <div className="flex flex-row">
        <div className="font-sans text-2xl text-gray-500 mb-2 grow">Units</div>
        {course && <AddUnitBtn course={course}></AddUnitBtn>}
    </div> 
    
      <div>
      {course && 
        units.filter((u) => u.course_id === course.course_id).map((unit, index) => {
          return (
            <div key={index} className="m-2 flex flex-row items-center border-slate-300 group relative">
              <div>
                
                  <ShowUnit unit={unit}/>
                
                
              </div>
            </div>
          );
        }
        )}    
      
    </div>
  </div>
</div>


  );
};

export default DisplayCourse;




const ShowUnit = ({unit}: {unit: Unit}) => {

  const [stateUnit, updateUnitToDB, isLoading] = useActionState(updateUnit, {data:null, error: null});
  const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);
  const [units, setUnits] = useAtom(UnitsAtom);  

const handleSelectUnit = ()=> {
    setCurrentDetailsObject(unit);
  }
  

  const handleLabelChange = (newTitle: string) => {
        
      // Optimistic Update UI
        const updatedUnit = { ...unit, title: newTitle } as Unit;
        // Update the course title in the UI
        setUnits(prev =>
            prev.map(c => c?.unit_id === unit?.unit_id ? updatedUnit : c)
        );

        // update the server
        startTransition(()=>{
            updateUnitToDB(updatedUnit!);
        });

      }

  

  useEffect(()=>{
    
    // ignore the forst load.
    if ((stateUnit.data === null && stateUnit.error === null))
      return;

    if (stateUnit.error){

      // return correct state in 
      setUnits(stateUnit.data as Units);

      toast.error(`Error!: ${stateUnit.error}`, {
      className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
    });
      return;
    } 
      
      
    
    toast.success("Update saved")
  
      },[stateUnit]);

  return (<div className="flex flex-row group relative items-center justify-between w-full p-2 border-b-[0.5px] hover:bg-gray-50 cursor-pointer">
            <EditLabel initialTitle={unit.title}
                    onLabelChange={handleLabelChange} 
                    displayClassName="text-black text-sm font-normal" 
                    editClassName="text-black w-[400px]" 
                    onClick={handleSelectUnit}/>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity"><DeleteUnitButton unit={unit}/></div>     
            </div>)
}