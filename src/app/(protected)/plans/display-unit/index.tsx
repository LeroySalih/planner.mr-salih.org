'use client';

/*
- [X] Rubric - Changing the LO name doesn't persist
- [X] Changing the Sucess Criteria doesn't persist
- [ ] Sucess Criteria can't be reordered
- [X] Adding a second LO to a lesson doesn't persist
- [X] Removing LO's from lessons doesn't persist
*/


import { Course } from '@/actions/courses/types';
import { updateCriteria } from '@/actions/criteria/updateCriteria';
import { LOLessonsMaps } from '@/actions/learning-objectives-lessons-map/types';
import { LearningObjective, LearningObjectives } from '@/actions/learning_objectives/types';
import { updateLearningObjective } from '@/actions/learning_objectives/updateLearningObjective';
import { reorderLessons } from '@/actions/lessons/reorderLessons';
import { Lesson, Lessons } from '@/actions/lessons/types';
import { updateLesson } from '@/actions/lessons/updateLesson';
import { Unit, Units } from '@/actions/units/types';
import { updateUnit } from '@/actions/units/updateUnit';
import { AssignmentsAtom, CoursesAtom, CriteriasAtom, CurrentDetailsObjectAtom, GroupsAtom, LearningObjectivesAtom, LessonsAtom, LOLessonsMapsAtom, UnitsAtom } from '@/atoms';
import EditLabel from '@/components/edit-label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAtom } from 'jotai';
import { NotebookText } from 'lucide-react';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddCriteriaBtn from './criteria-btn-add';
import DeleteCriteriaButton from './criteria-btn-delete';
import AddLearningObjectiveBtn from './learning-objective-btn-add';
import DeleteLearningObjectiveButton from './learning-objective-btn-delete';
import AddLessonBtn from './lesson-btn-add';
import DeleteLessonButton from './lesson-btn-delete';
import MoveDownLessonButton from './lesson-btn-move-down';
import MoveUpLessonButton from './lesson-btn-move-up';
import LessonList from './lesson-list';
import DeleteUnitButton from './unit-btn-delete';

import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MultiSelectCheckboxes from '@/components/multiselect';
import { sync } from 'framer-motion';
import { syncAssignments } from '@/actions/assignments/syncAssignments';

import LOList, { DisplayLearningObjective } from './display-lo';
import { DisplayLearningObjectives} from './display-lo';

interface DisplayUnitProps {
    
}   
  // Define any props you need here, for example:}

const DisplayUnit = () => {

    const [loLesonsMaps, setLOLessonsMaps] = useAtom<LOLessonsMaps>(LOLessonsMapsAtom);
    const [learningObjectives, setLearningObjectives] = useAtom<LearningObjectives | null>(LearningObjectivesAtom);
    const [criterias, setCriteria] = useAtom(CriteriasAtom);  
    const [lessons, setLessons] = useAtom(LessonsAtom);
    const [units, setUnits] = useAtom(UnitsAtom);
    
    const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);
    
    const [parentCourse, setParentCourse] = useState<null | Course>();
    const [unit, setUnit] = useState<null | Unit>(null);
    const [courses, setCourses] = useAtom(CoursesAtom);
    const [assignments, setAssignments] = useAtom(AssignmentsAtom);

    //console.log("Assignments (client)", assignments)

    const [stateUnit, updateUnitToDB, isLoading] = useActionState(updateUnit, {data:null, error: null});
    const [stateLessonReorder, reorderLessonsToDB, isReordering] = useActionState(reorderLessons, {data:null, error: null});
  
    
    // convert teh currentDetailsObject to a Unit
    // this is done to ensure that the unit is always a Unit type.
    // this is because the currentDetailsObject can be a Course or a Unit.
    // and we need to ensure that we are always working with a Unit type.
    useEffect(()=> {

      setUnit(currentDetailsObject as Unit)

      if (currentDetailsObject != null){
        setParentCourse(courses?.filter((c: Course) => c.course_id === (currentDetailsObject as Unit).course_id)[0])
      }
    }, [currentDetailsObject]);

    const getLearningObjectivesForUnit = (unitId: string): LearningObjective[] => {
        return learningObjectives
            ? learningObjectives.filter(lo => lo.unit_id === unitId)
            : [];
    };

    const handleCourseClick = () => {
      setCurrentDetailsObject(parentCourse!);
    }

    const handleTitleChange = (newTitle: string) => {

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
   

    const getLessons = (): Lesson[] => {
        const unitLessons = lessons.filter(l => l.unit_id === unit?.unit_id)
            .sort((a, b) => a.order_by - b.order_by);

          //console.log("getLessons returning Unit Lessons", unitLessons);
          return unitLessons;
    };

    const handleOnReorder = (newOrder: Lesson[]) => {
        
        //console.log("Reordering Lessons", newOrder);

        const updatedLessons = newOrder.map((lesson, index) => ({ 
          ...lesson,
          order_by: index, // Update the order_by field based on the new index
        }));

        // Update the lessons atom with the new order
        setLessons(prev =>  prev.map((lesson) => updatedLessons.find(l => l.lesson_id === lesson.lesson_id) || lesson));
        
        // Update the server with the new order
        startTransition(() => {
            reorderLessonsToDB(updatedLessons);
        });

    };

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

        toast.success("Reorder saved")

    },[stateLessonReorder]);
    

    return (
        <div className="h-full">
          <div className="cursor-pointer text-sm text-slate-400" onClick={handleCourseClick}>{parentCourse && parentCourse.title}</div>
        <div className='flex flex-row items-center text-3xl font-bold mt-8 border-b-2 border-gray-200 pb-4 mb-4'>
          <NotebookText className="w-6 h-6 text-blue-500 mr-2" />
          <EditLabel initialTitle={unit?.title || ""} 
            onLabelChange={handleTitleChange } 
            allowEditOnClick={true}
            onClick={()=>{}}/>
        </div>
      <div>
        {unit && <DeleteUnitButton unit={unit}/>}
      </div>

      <div className="mt-8">
        <Tabs defaultValue="rubric">

          <TabsList>
            <TabsTrigger value="rubric">Rubric</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="rubric">
            <div className="h-full overflow-y-auto">
                <div>
                  <div className="font-sans text-2xl text-gray-500 mb-2 flex flex-row">
                    <div className="grow">Rubric</div>
                    {unit && <AddLearningObjectiveBtn unit={unit}/>}
                  </div>
                </div>
                {unit && <LOList initial={unit} onReorder={()=>{}}/>}
                {unit && <DisplayLearningObjectives unit_id={unit?.unit_id}/>}

                {/*
                  unit && getLearningObjectivesForUnit(unit.unit_id)
                      .sort((a, b) => a.order_by - b.order_by).map((lo, index) => {
                      return (
                        <DisplayLearningObjective key={lo.learning_objective_id || uuidv4()} index={lo.learning_objective_id} lo={lo}/>
                      );
                    })  
                */
                }
                </div>
          </TabsContent>

          <TabsContent value="lessons">
    
            <div>
                {unit && <AddLessonBtn unit={unit!} />}
            </div>
            <div>
              {lessons && unit && <LessonList  initialLessons={lessons.filter(l => l.unit_id === unit?.unit_id).sort((a, b)=> a.order_by - b.order_by)} onReorderComplete={handleOnReorder} />}
            </div>
          </TabsContent>

          <TabsContent value="assignments">
                {unit && <DisplayAssignments unit={unit}/>}
            
          </TabsContent>
          
        </Tabs>
      </div>


      
     


  


   

  
</div>

  );
};

export default DisplayUnit;






const DisplayLesson = ({index, lesson}: {index: number,  lesson:Lesson}) => {

  const [stateLesson, updateLessonToDB, isLoading] = useActionState(updateLesson, {data:null, error: null});
  const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);
  const [lessons, setLessons] = useAtom(LessonsAtom);
  
  const handleLabelChange = (newTitle: string) => {
        
      // Optimistic Update UI
        const updatedLesson = { ...lesson, title: newTitle } as Lesson;
        
        // Update the lesson title in the UI
        setLessons(prev =>
            prev.map(l => l?.lesson_id === lesson?.lesson_id ? updatedLesson : l)
        );

        // update the server
        startTransition(()=>{
            updateLessonToDB(updatedLesson!);
        });

  }


  useEffect(()=>{
    
    // ignore the forst load.
    if ((stateLesson.data === null && stateLesson.error === null))
      return;

    if (stateLesson.error){

      // return correct state in 
      setLessons(stateLesson.data as Lessons);

      toast.error(`Error!: ${stateLesson.error}`, {
      className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
    });
      return;
    } 
      
      
    
    toast.success("Update saved")
  
      
  
  },[stateLesson]);

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentDetailsObject(lesson);
  }
 

  return <div className="flex flex-row items-center m-2 gap-2 cursor-pointer group  ">
    <div className="flex flex-row text-sm relative w-6 h-6  text-[8pt] font-sans  border-2 border-blue-500 rounded-full text-black justify-center items-center">{index + 1}</div>
    <div className="text-black text-sm font-normal flex flex-row group items-center">
      <EditLabel initialTitle={lesson.title} onClick={()=>handleLessonClick(lesson)} onLabelChange={handleLabelChange} />
      <div className="opacity-0  group-hover:opacity-100 transition-opacity duration-200 ease-in-out
             rounded ml-2"><DeleteLessonButton lesson={lesson}/> </div>
      <div className="opacity-0  group-hover:opacity-100 transition-opacity duration-200 ease-in-out
             rounded"><MoveUpLessonButton lesson={lesson} disabled={index == 0}/> </div>
      <div className="opacity-0  group-hover:opacity-100 transition-opacity duration-200 ease-in-out
             rounded"><MoveDownLessonButton lesson={lesson} disabled={index == lessons.filter(l => l.unit_id === lesson.unit_id).length - 1}/> </div>
       
    </div>
  </div>
}





const DisplayAssignments = ({unit}:{unit: Unit}) => {


  const [assignments, setAssignments] = useAtom(AssignmentsAtom);
  const [groups, setGroups] = useAtom(GroupsAtom);
  const [state, syncAssignment, pending] = useActionState(syncAssignments,{data:null, error: null} );

  const handleAssignmentChange = (newGroups: string[]) => {
    
    //console.log("New Assignments", newGroups);

    const newAssignments = assignments ? [
      // remove the existing
      ...assignments?.filter(a => a.unit_id !== unit.unit_id),

      // add the new groups
      ...newGroups.map((ng) => ({
        type:"assignment",
        unit_id: unit.unit_id,
        active: true,
        
        created: new Date(),
        group_id: ng,
        assignment_from: null,
        unit_title: unit.title,
        group_title: groups?.filter(g => g.group_id == ng)[0].title || ""
      }))
    ] : [];

    
    setAssignments(newAssignments);

    startTransition(()=>{
      syncAssignment({unitId: unit.unit_id, groupIds: newGroups});
    })
  };

  useEffect(()=>{
    // ignore the forst load.
    if ((state.data === null && state.error === null))
      return;

    if (state.error){

      // return correct state in 
      setAssignments(state.data as any);

      toast.error(`Error!: ${state.error}`, {
        className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
      });
      return;
    } 

    toast.success("Update saved");
  }, [state]);  


  return (<div>
              <div className="flex flex-row">
            

          Edit Assignments 1<MultiSelectCheckboxes 
            options={groups?.map(g => ({id: g.group_id, label: g.title || "", value:g.group_id})) || []} 
            placeholder='Select Group' 
            initialValues={assignments?.filter(a => a.unit_id == unit.unit_id).map((a) => a.group_id)} 
            onSelectionChange={handleAssignmentChange}           
          />
            
            </div>

            <div className="flex flex-row gap-2">
            {
              // all groups assigned to this unit
              assignments?.filter((a) => a.unit_id == unit.unit_id).map((a,i) => <div key={Math.random()} className="m-2 flex flex-col border-[0.5px] border-neutral-300 p-2 rounded-xl">
                <div className="text-md ">{a.group_title}</div>
                
              </div>) 
            }
            </div>

            
            </div>
            )
}