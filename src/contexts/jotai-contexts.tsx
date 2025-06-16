// app/context/JotaiProvider.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { Provider, useSetAtom } from "jotai";
import { CoursesAtom , LearningObjectivesAtom, LessonsAtom, NCSAtom, UnitsAtom, CriteriasAtom, LOLessonsMapsAtom } from "@/atoms";
import { Courses} from "@/actions/courses/types";
import { NCs } from "@/actions/ncs/types";
import { Units, UnitsSchema } from "@/actions/units/types";
import { LearningObjectives } from "@/actions/learning_objectives/types";
import { useHydrateAtoms } from "jotai/utils";
import { Lessons } from "@/actions/lessons/types";
import { Criterias } from "@/actions/criteria/types";
import { LOLessonsMaps } from "@/actions/learning-objectives-lessons-map/types";




// This helper sets the atom once the component mounts
const Initializer = (
        { onReady, initialCourses, initialNCs, initialUnits, initialLOs, initialLessons, initialCriteria, initialLOLessonMaps }: 
        {   
            onReady: ()=>void,
            initialCourses: Courses | null,
            initialNCs: NCs | null, 
            initialUnits: Units | null,
            initialLOs: LearningObjectives | null,
            initialLessons: Lessons | null,
            initialCriteria: Criterias | null,
            initialLOLessonMaps: LOLessonsMaps | null
         }) => {


          
            
            useHydrateAtoms([
                [CoursesAtom, initialCourses!],
                [NCSAtom, initialNCs!],
                [UnitsAtom, initialUnits!],
                [LearningObjectivesAtom, initialLOs!],
                [LessonsAtom, initialLessons!],
                [CriteriasAtom, initialCriteria!],
                [LOLessonsMapsAtom, initialLOLessonMaps!]
            ]);

            // prevent server render by only rendering on the client.
            // this stops hydration errors!
            useEffect(()=>{
                onReady();
            }, []);

            return null;
};

type Props = {
  children: ReactNode;
  initialCourses: Courses | null;
  initialNCs: NCs | null;
  initialUnits: Units | null;
  initialLOs : LearningObjectives | null;
  initialLessons: Lessons | null;
  initialCriteria: Criterias | null;
  initialLOLessonMaps: LOLessonsMaps | null;
};

export const JotaiProvider = ({ children, initialCourses, initialNCs, initialUnits, initialLOs, initialLessons, initialCriteria, initialLOLessonMaps }: Props) => {
    
    const [ready, setReady] = useState<boolean>(false);

    return (
    <Provider>
        {// only render on the client, to prevent hydration erros
        }
        {!ready ? null : children}
      <Initializer onReady={()=>{setReady(true)}} 
            initialCourses={initialCourses} 
            initialNCs={initialNCs} 
            initialUnits={initialUnits} 
            initialLOs={initialLOs} 
            initialLessons={initialLessons} 
            initialCriteria={initialCriteria} 
            initialLOLessonMaps={initialLOLessonMaps}/>
      
    </Provider>
  );
};
