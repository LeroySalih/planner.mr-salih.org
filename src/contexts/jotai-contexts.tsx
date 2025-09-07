// app/context/JotaiProvider.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { Provider, useSetAtom } from "jotai";
import { CoursesAtom , LearningObjectivesAtom, LessonsAtom, NCSAtom, UnitsAtom, CriteriasAtom, LOLessonsMapsAtom,  AssignmentsAtom, GroupsAtom, ActivitiesAtom } from "@/atoms";
import { Courses} from "@/actions/courses/types";
import { NCs } from "@/actions/ncs/types";
import { Units, UnitsSchema } from "@/actions/units/types";
import { LearningObjectives } from "@/actions/learning_objectives/types";
import { useHydrateAtoms } from "jotai/utils";
import { Lessons } from "@/actions/lessons/types";
import { Criterias } from "@/actions/criteria/types";
import { LOLessonsMaps } from "@/actions/learning-objectives-lessons-map/types";
import { Assignments } from "@/actions/assignments/types";
import { Groups } from "@/actions/groups-memberships/types";
import { Activities } from "@/actions/activities/types";




// This helper sets the atom once the component mounts
const Initializer = (
        { onReady, initialCourses, initialNCs, initialUnits, initialLOs, initialLessons, initialActivities, initialCriteria, initialLOLessonMaps, initialAssignments, initialGroups }: 
        {   
            onReady: ()=>void,
            initialCourses: Courses | null,
            initialNCs: NCs | null, 
            initialUnits: Units | null,
            initialLOs: LearningObjectives | null,
            initialLessons: Lessons | null,
            initialActivities: Activities | null,
            initialCriteria: Criterias | null,
            initialLOLessonMaps: LOLessonsMaps | null,
            initialAssignments: Assignments | null,
            initialGroups: Groups | null,
         }) => {


          
            
            useHydrateAtoms([
                [CoursesAtom, initialCourses!],
                [NCSAtom, initialNCs!],
                [UnitsAtom, initialUnits!],
                [LearningObjectivesAtom, initialLOs!],
                [LessonsAtom, initialLessons!],
                [ActivitiesAtom, initialActivities!],
                [CriteriasAtom, initialCriteria!],
                [LOLessonsMapsAtom, initialLOLessonMaps!],
                [AssignmentsAtom, initialAssignments!],
                [GroupsAtom, initialGroups!]
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
  initialActivities: Activities | null;
  initialCriteria: Criterias | null;
  initialLOLessonMaps: LOLessonsMaps | null;
  initialAssignments: Assignments | null;
  initialGroups: Groups | null;
  
};

export const JotaiProvider = ({ children, initialCourses, initialNCs, initialUnits, initialLOs, initialLessons, initialActivities,  initialCriteria, initialLOLessonMaps, initialAssignments, initialGroups }: Props) => {
    
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
            initialActivities={initialActivities}
            initialCriteria={initialCriteria} 
            initialLOLessonMaps={initialLOLessonMaps}
            initialAssignments={initialAssignments}
            initialGroups={initialGroups}
        />
      
    </Provider>
  );
};

