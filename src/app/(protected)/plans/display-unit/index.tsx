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
import { CoursesAtom, CriteriasAtom, CurrentDetailsObjectAtom, LearningObjectivesAtom, LessonsAtom, LOLessonsMapsAtom, UnitsAtom } from '@/atoms';
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

          console.log("getLessons returning Unit Lessons", unitLessons);
          return unitLessons;
    };

    const handleOnReorder = (newOrder: Lesson[]) => {
        
        console.log("Reordering Lessons", newOrder);

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
          </TabsList>

          <TabsContent value="rubric">
            <div className="h-full overflow-y-auto">
                <div>
                  <div className="font-sans text-2xl text-gray-500 mb-2 flex flex-row">
                    <div className="grow">Rubric</div>
                    {unit && <AddLearningObjectiveBtn unit={unit}/>}
                  </div>
                </div>
                {
                  unit && getLearningObjectivesForUnit(unit.unit_id)
                    .map((lo, index) => {
                      return (
                        <DisplayLearningObjective key={lo.learning_objective_id || uuidv4()} index={lo.learning_objective_id} lo={lo}/>
                      );
                    })  
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
          
        </Tabs>
      </div>


      
     


  


   

  
</div>

  );
};

export default DisplayUnit;



const DisplayLearningObjective = ({lo, index}:{lo:LearningObjective, index:string}) => {
  
  const [criterias, setCriterias] = useAtom(CriteriasAtom);
  const [loLesonsMaps, setLOLessonsMaps] = useAtom<LOLessonsMaps>(LOLessonsMapsAtom);

  const [learningObjectives, setLearningObjectives] = useAtom<LearningObjectives>(LearningObjectivesAtom);
  const [stateLO, updateLOToDB, isLoading] = useActionState(updateLearningObjective, {data:null, error: null});

  const handleLabelChange = (newTitle: string) => {
    // Optimistic Update UI
    const updatedLO = { ...lo, title: newTitle } as LearningObjective;
    // Update the learning objective title in the UI
    setLearningObjectives(prev =>
        prev.map(c => c?.learning_objective_id === lo?.learning_objective_id ? updatedLO : c)
    );  

    startTransition(()=>{
      updateLOToDB(updatedLO!);
    }
    );  


  }

  useEffect(()=>{
    // ignore the forst load.
    if ((stateLO.data === null && stateLO.error === null))
      return;

    if (stateLO.error){

      // return correct state in 
      setLearningObjectives(stateLO.data as LearningObjectives);

      toast.error(`Error!: ${stateLO.error}`, {
        className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
      });
      return;
    } 

    toast.success("Update saved");
  }, [stateLO])

  return (<div key={index} className="m-4 p-4 border-[0.5px] border-neutral-300 cursor-pointer rounded-lg relative hover:bg-neutral-50 transition-all duration-200 ease-in-out">
              <div className="flex flex-row items-center justify-between mb-2">
                <div className="font-bold flex flex-row items-center group">
                  <EditLabel initialTitle={lo.title} 
                    onLabelChange={handleLabelChange} 
                    onClick={()=>{} }/>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"><DeleteLearningObjectiveButton lo={lo} /></div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"><AddCriteriaBtn lo={lo} /></div>
                </div>
                <div className="text-[8pt] border-[0.5] border-neutral-300 bg-neutral-100 px-2 rounded-full ">
                  {loLesonsMaps.filter(lom => lom.learning_objective_id === lo.learning_objective_id).length} 
                  &nbsp;Lessons</div>
              </div>
              
              {
                criterias
                  .filter(c => c.learning_objective_id === lo.learning_objective_id)
                  .sort((a, b) => a.order_by - b.order_by)
                  .map((criteria, j) => (
                    <div key={criteria.criteria_id} className="ml-4 text-sm text-gray-600 relative group">
                      <DisplayCriteria criteria={criteria} />
                    </div>
                  ))
              }
            </div>)
}


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


const DisplayCriteria = ({criteria}:{criteria: any}) => {
  
  const [criterias, setCriterias] = useAtom(CriteriasAtom);
  const [stateCriteria, updateCriteriaToDB, isLoading] = useActionState(updateCriteria, {data:null, error: null});
  
  const handleLabelChange = (newTitle: string) => {
    // Optimistic Update UI
    const updatedCriteria = { ...criteria, title: newTitle } as any;
    // Update the criteria title in the UI
    setCriterias(prev =>
        prev.map(c => c?.criteria_id === criteria?.criteria_id ? updatedCriteria : c)
    );

    startTransition(()=>{
      updateCriteriaToDB(updatedCriteria!);
    });
  } 

  useEffect(()=>{
    // ignore the forst load.
    if ((stateCriteria.data === null && stateCriteria.error === null))
      return;

    if (stateCriteria.error){

      // return correct state in 
      setCriterias(stateCriteria.data as any);

      toast.error(`Error!: ${stateCriteria.error}`, {
        className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
      });
      return;
    } 

    toast.success("Update saved");
  }, [stateCriteria]);  
  
  return (
    <div className="ml-4 text-sm text-gray-600 flex flex-row items-center gap-2 ">
      <div><EditLabel 
        initialTitle={criteria.title} 
        onClick={()=>{}} 
        onLabelChange={handleLabelChange} /></div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"><DeleteCriteriaButton criteria={criteria} /></div>
    </div>
  );
}