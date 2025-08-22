'use client';

import { Lesson } from '@/actions/lessons/types';
import { ReactNode, useState, useEffect, act, ChangeEvent, useActionState, startTransition } from 'react';
import {BookOpen} from 'lucide-react';
import { LOLessonsMaps } from '@/actions/learning-objectives-lessons-map/types';
import { ActivitiesAtom, CoursesAtom, CriteriasAtom, CurrentDetailsObjectAtom, LearningObjectivesAtom, LessonsAtom, LOLessonsMapsAtom, UnitsAtom } from '@/atoms';
import { useAtom } from 'jotai';
import { LearningObjective, LearningObjectives } from '@/actions/learning_objectives/types';
import { Course } from '@/actions/courses/types';
import { Unit } from '@/actions/units/types';
import { Activities, Activity, ActivityType } from '@/actions/activities/types';

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import styles from './image.module.css'
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateActivity } from '@/actions/activities/updateActivity';
import { toast } from 'sonner';

import Tiptap from '@/components/tip-tap';
import { DisplayActivityText } from './display-activity-text';
import DisplayActivityKeywords from "./display-activity-keyword";
import DisplayActivityVideo from "./display-activity-video";

import { DisplayActivityProps } from './types';
import { DisplayActivity } from './display-activity';
import AddActivityBtn from './activity-btn-add';
import DeleteLessonBtn from './lesson-btn-delete';
import EditLabel from '@/components/edit-label';
import { updateLesson } from '@/actions/lessons/updateLesson';
import { Lessons } from '@/actions/lessons/types'; 

interface DisplayLessonProps {
    
}   
  // Define any props you need here, for example:}

const DisplayLesson = () => {

    const [loLesonsMaps, setLOLessonsMaps] = useAtom<LOLessonsMaps>(LOLessonsMapsAtom);
    const [learningObjectives, setLearningObjectives] = useAtom<LearningObjectives | null>(LearningObjectivesAtom);
    const [criterias, setCriteria] = useAtom(CriteriasAtom);  
    const [parentCourse, setParentCourse] = useState<Course | null>(null);
    const [parentUnit, setParentUnit] = useState<Unit | null>(null)
    const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [lessons, setLessons] = useAtom(LessonsAtom);
    const [units, setUnits] = useAtom(UnitsAtom);
    const [courses, setCourses] = useAtom(CoursesAtom);
    const [activities, setActivities] = useAtom(ActivitiesAtom);

    const [stateLessons, updateLessonToDB, isLoading] = useActionState(updateLesson, {data:null, error: null});
        
    useEffect (()=>{
      setLesson(currentDetailsObject as Lesson);
    }, [currentDetailsObject]);

    useEffect(()=>{
      setParentUnit(prev => units.filter(u => u.unit_id === lesson?.unit_id)[0]);
    }, [lesson]);


    useEffect(()=>{
      setParentCourse(prev => courses.filter(c => c.course_id === parentUnit?.course_id)[0]);
    }, [parentUnit]);

    const handleCourseClick = () => {
      setCurrentDetailsObject(parentCourse)
    }

    const handleUnitClick = () => {
      setCurrentDetailsObject(parentUnit)
    }

    const handleLabelChange = (newTitle: string) => {

      // Optimistic Update UI
        const updatedLesson = { ...lesson, title: newTitle } as Lesson;
        
        // Update the course title in the UI
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
      
    },[stateLessons]);
    
    return (
        <>
  <div className=' items-center  mt-8 border-b-2 border-gray-200 pb-4 mb-4'>
    <div className="text-sm text-neutral-400 flex flex-row mb-2">
      <div className="cursor-pointer" onClick={handleCourseClick}>{parentCourse?.title}</div>&nbsp;&gt;&nbsp;
      <div className="cursor-pointer" onClick={handleUnitClick}>{parentUnit?.title}</div>
    </div>

    <div className="text-3xl font-bold flex flex-row">
      <BookOpen className="w-6 h-6 text-blue-500 mr-2" />
      {lesson && <EditLabel initialTitle={lesson?.title} onLabelChange={handleLabelChange} onClick={()=>{}} allowEditOnClick={true}/>}
    </div>

    <div>
      {lesson && <DeleteLessonBtn lesson={lesson} onDelete={()=>{}}/>}
    </div>
  </div>

  <div>
    
    <div className="font-sans text-2xl text-gray-500 mb-2">Lesson Objectives & Criteria</div>
    {
      lesson && loLesonsMaps
        .filter(loMap => loMap.lesson_id === lesson.lesson_id)
        .map((loMap, index) => {
          return (
            <div key={index} className="m-4 p-4 border-[0.5px] border-neutral-300 rounded-lg">
              {
                learningObjectives
                  ?.filter((lo: LearningObjective) => lo.learning_objective_id === loMap.learning_objective_id)
                  .map((lo: LearningObjective, i: number) => (
                    <div key={i}>
                      <div>{lo.title}</div>
                      {
                        criterias
                          .filter(c => c.learning_objective_id === lo.learning_objective_id)
                          .map((criteria, j) => (
                            <div key={j} className="ml-4 text-sm text-gray-600">
                              {criteria.title}
                            </div>
                          ))
                      }
                    </div>
                  ))
              }
              
            </div>
          );
        })
    }
    <div>
      <div className="flex flex-row items-center"> 
        <div className="grow flex flex-row items-center">Activities ({activities.filter(a => a.lesson_id === lesson?.lesson_id).length})</div>
        <Button variant="outline">Add Activity</Button>
        {lesson && <AddActivityBtn lesson={lesson}/>}
      </div>
      <div>
        {
          activities.sort((a, b)=> a.order_by - b.order_by).filter(a => a.lesson_id == lesson?.lesson_id).map((activity, i) => <DisplayActivity key={activity.activity_id} activity={activity}/>)
        }
       </div>
      </div>
  </div>
</>

  );
};

export default DisplayLesson;

















