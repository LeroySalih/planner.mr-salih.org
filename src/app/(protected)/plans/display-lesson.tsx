'use client';

import { Lesson } from '@/actions/lessons/types';
import { ReactNode, useState, useEffect, act } from 'react';
import {BookOpen} from 'lucide-react';
import { LOLessonsMaps } from '@/actions/learning-objectives-lessons-map/types';
import { ActivitiesAtom, CoursesAtom, CriteriasAtom, CurrentDetailsObjectAtom, LearningObjectivesAtom, LessonsAtom, LOLessonsMapsAtom, UnitsAtom } from '@/atoms';
import { useAtom } from 'jotai';
import { LearningObjective, LearningObjectives } from '@/actions/learning_objectives/types';
import { Course } from '@/actions/courses/types';
import { Unit } from '@/actions/units/types';
import { Activity, ActivityType } from '@/actions/activities/types';

import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import styles from './image.module.css'
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    
    return (
        <>
  <div className=' items-center  mt-8 border-b-2 border-gray-200 pb-4 mb-4'>
    <div className="text-sm text-neutral-400 flex flex-row mb-2">
      <div className="cursor-pointer" onClick={handleCourseClick}>{parentCourse?.title}</div>&nbsp;&gt;&nbsp;
      <div className="cursor-pointer" onClick={handleUnitClick}>{parentUnit?.title}</div>
    </div>

    <div className="text-3xl font-bold flex flex-row">
      <BookOpen className="w-6 h-6 text-blue-500 mr-2" />
      {lesson?.title}
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
    <div>Activities ({activities.length})</div>

      {
        activities.map((activity, i) => <DisplayActivity key={activity.activity_id} activity={activity}/>)
      }
  </div>
</>

  );
};

export default DisplayLesson;


export type DisplayActivityProps = {
  activity: Activity,
  editing: boolean,
  onEditingEnd: ()=>{}
}


export const DisplayActivity = ({activity}: {activity: Activity}) => {
  
  const [editing, setEditing] = useState<boolean>(false);

  const displayActivitySwitch = (activity: Activity, editing: boolean) => {

  const handleEditingEnd = () => {
    setEditing (false)
  }

  switch (activity.activity_type) {
    case "keywords" : return <DisplayActivityKeywords activity={activity} editing={editing} onEditingEnd={handleEditingEnd}/>
    case "text" : return <DisplayActivityText activity={activity} editing={editing} onEditingEnd={handleEditingEnd}/>
    case "video" : return <DisplayActivityVideo activity={activity} editing={editing} onEditingEnd={handleEditingEnd}/>
    case "images" : return <DisplayActivitiesImages activity={activity} editing={editing} onEditingEnd={handleEditingEnd} />
    default: return <DisplayActivityUnknown activity={activity} editing={editing} onEditingEnd={handleEditingEnd}/>
  }
}

  const handleEditingClick = () => {
    setEditing(!editing)
  }

  return <div className="border-neutral-400 border-[1px] m-4 p-2 rounded-lg">
    <div>
      {activity.title}
      <Checkbox checked={editing} onClick={handleEditingClick}/>
    </div>
    {displayActivitySwitch(activity, editing)}
    </div>
}

export const DisplayActivityUnknown = ({activity, editing}: DisplayActivityProps) => {

  return <div>Unknown: {activity.type}</div>
}

export const DisplayActivityText = ({activity, editing}: DisplayActivityProps) => {

  console.log("Activity", activity.body.html)
  return <div>
      <div dangerouslySetInnerHTML={{__html: activity.body.html}}></div> 
      
  </div>
}

export const DisplayActivityKeywords = ({activity, editing}: DisplayActivityProps) => {

  return <div>
      <div className="text-red-400">Keywords</div> 
      <div className="grid grid-cols-[100px_auto]">
      {activity.body.map((kw: {keyword: string, definition: string}, i: number) => [<div key={`1${i}`}>{kw.keyword}</div>,<div  key={`2${i}`}>{kw.definition}</div>])}
      </div>
      </div>
}


export const DisplayActivityVideo = ({activity, editing, onEditingEnd}: DisplayActivityProps) => {
  
  const url = activity.body.url;
  const [code, setCode] = useState<string | null>(null);
  if (editing) {
    return <div >

      <div>Enter video code</div>
      <div><Input/></div>
      <div>
        <Button onClick={}>Save</Button>
        <Button>Cancel</Button>
      </div>

    </div>
  }

  return <div>
    <iframe width="560" height="315" src={`https://www.youtube.com/embed/${url}?si=RfeIycR56YI2yBaQ&amp;`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
  </div>
} 




const images = [
  {
    original: "/content/activity/1/",
    thumbnail: "/content/activity/1",
  },
  {
    original: "/content/activity/1",
    thumbnail: "/content/activity/1",
  },
  {
    original: "/content/activity/1",
    thumbnail: "/content/activity/1",
  },
];


export const DisplayActivitiesImages = ({activity, editing}: DisplayActivityProps) => {

  

return <div>Images
    <div className="h-[300px] w-full">
    <ImageGallery items={images} />;
    </div>
    </div>

}