import { type Courses, type Course } from "@/actions/courses/types";
import { LearningObjective, LearningObjectives } from "@/actions/learning_objectives/types";
import { type NCs, type NC } from "@/actions/ncs/types";
import { type Units, type Unit } from "@/actions/units/types";
import { Lesson, type Lessons } from "@/actions/lessons/types";

import { atom } from "jotai";
import { Criterias } from "@/actions/criteria/types";
import { LOLessonsMaps } from "@/actions/learning-objectives-lessons-map/types";


export type DisplayMode = "courses" | "units" | "lessons";
export const PlanningDisplayModeAtom = atom<DisplayMode>("courses")

export const NCSAtom = atom<NCs>([]);
export const CoursesAtom = atom<Courses>([]);
export const UnitsAtom = atom<Units>([]);

export const LearningObjectivesAtom = atom<LearningObjectives>([]);
export const LessonsAtom = atom <Lessons>([]);

export const CriteriasAtom = atom<Criterias>([]);

export const LOLessonsMapsAtom = atom<LOLessonsMaps>([]);

export const CurrentCourseAtom = atom<Course | null>(null);
export const CurrentUnitAtom = atom<Unit | null>(null);
export const CurrentLessonAtom = atom<Lesson | null>(null);


export const CurrentDetailsObjectAtom = atom<Course | Unit | Lesson | null>(null);


// return the NC that matches the current course.
export const CurrentNCAtom = atom<NC | null>((get) => {
    const currentCourse = get(CurrentCourseAtom);
    const ncs = get(NCSAtom);
    
    if (currentCourse === null){
        return null;
    }

    return ncs.filter(nc => nc.nc_id === currentCourse.nc_id)?.[0];

});

export const CurrentUnitsAtom = atom<Units>((get) => {
    const currentCourse = get(CurrentCourseAtom);
    const units = get(UnitsAtom);

    if (currentCourse === null){
        return units;
    }

    return units.filter((u:Unit) => u.course_id === currentCourse.course_id);
});

// return a list of learning objectives for the current course.
// this means any learning object with a unti_id in the set of CurrentUnits.

export const CurrentLearningObjectivesAtom = atom<LearningObjectives | null>((get) => {

    const units = get(CurrentUnitsAtom);
    const learningObjectives = get(LearningObjectivesAtom);

    // construct the list of current unit_ids
    const unit_ids = units.map((u:Unit) => u.unit_id);

    // returning lo's that have a unit_id in the current list. 
    return learningObjectives.filter((lo:LearningObjective) => unit_ids.includes(lo.unit_id) )
});



