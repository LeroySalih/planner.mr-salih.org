"use client"

import React from "react";

import { useAtom } from "jotai";
import { CoursesAtom, LessonsAtom, UnitsAtom } from "@/atoms";
import { LibraryBig } from "lucide-react";
import { Book } from "lucide-react";
import { NotebookText } from "lucide-react";

import { Button } from "@/components/ui/button";
import CoursesNavigation from "./courses-navigation";
import { Course } from "@/actions/courses/types";
import { Unit } from "@/actions/units/types";
import { Lesson } from "@/actions/lessons/types";
import DisplayObject from "./display-object";

const Teacher = () => {

    const [courses, setCourses] = useAtom(CoursesAtom);
    const [units, setUnits]= useAtom(UnitsAtom);
    const [lessons, setLessons] = useAtom(LessonsAtom);

    const [displayMode, setDisplayMode] = React.useState<'courses' | 'units' | 'lessons'>('courses');
    const [displayObject, setDisplayObject] = React.useState<null | Course | Unit | Lesson>(null);

    const handleChangeNavigation = (mode: 'courses' | 'units' | 'lessons', object: null | Course | Unit | Lesson) => {
        setDisplayMode(mode);
        setDisplayObject(object);
    };

    return (
        <div className="flex flex-row w-full h-screen bg-white-100" >

            <div className="w-[50%] p-4 h-full bg-white-50">
                <CoursesNavigation onChangeNavigation={handleChangeNavigation}/>
            </div>

            <div className="w-[50%] p-4 h-full">
                <DisplayObject  />
            </div>

        </div>
    );
};

export default Teacher;