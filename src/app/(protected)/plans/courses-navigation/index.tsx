'use client';

import { ReactNode } from 'react';
import { useAtom } from "jotai";
import { CoursesAtom, CurrentDetailsObjectAtom, LessonsAtom, UnitsAtom } from "@/atoms";
import { LibraryBig } from "lucide-react";
import { Book } from "lucide-react";
import { NotebookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {geistSans} from "@/fonts"
import { Course } from '@/actions/courses/types';
import { Lesson } from '@/actions/lessons/types';
import { Unit } from '@/actions/units/types';
import { BookOpen } from 'lucide-react';
import AddCourseBtn from './course-btn-add';

interface CoursesNavigationProps {
    onChangeNavigation?: (
        mode: 'courses' | 'units' | 'lessons', 
        object: null | Course | Unit | Lesson
    ) => void;
}

const CoursesNavigation = ({ onChangeNavigation }: CoursesNavigationProps) => {

    const [courses, setCourses] = useAtom(CoursesAtom);
    const [units, setUnits]= useAtom(UnitsAtom);
    const [lessons, setLessons] = useAtom(LessonsAtom);
    const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);

    const handleChangeNavigation = (object: null | Course | Unit | Lesson) => {
        console.log("handleChangeNavigation", object)
        setCurrentDetailsObject(object)
    };

    //console.log("Courses:", courses);
  return (
    <div className="h-full w-full p-4 bg-white-100">
      <div className="text-3xl font-semibold leading-none tracking-tigh ml-4 flex flex-row items-center">
                    <LibraryBig className="inline-block mr-2" />
                    <div className="grow">Courses</div>
                    
                    <AddCourseBtn />
                </div>
                <div className='h-full overflow-y-auto'>
                {courses?.sort((a:Course, b:Course) => b.order_by! - a.order_by!)
                    .map((c:Course, i: number) => (
                    <details key={c.course_id} className="border-2 border-neutral-200 rounded-xl p-4 m-4 group relative hover:bg-neutral-50 transition-all duration-200 ease-in-out cursor-pointer">
                        <summary onClick={() => handleChangeNavigation(c) } className={`text-2xl font-semibold leading-none tracking-tight border-b-[0.5px] border-neutral-200 pb-2 mb-2 flex items-center gap-2 ${geistSans.className}`}>
                            <Book className="inline-block mr-2" />
                            {c.title}
                        </summary>
                        <div>
                            
                            {
                               units.filter(u => u.course_id === c.course_id)
                               .sort((a, b) => a.order_by - b.order_by)
                               .map((u, i) => (
                               <details  key={u.unit_id} className="text-lg flex flex-col gap-4 text-sm 
                                        align-middle p-2  border-[0.5px]  m-2 group relative
                                        height-full+
                                        hover:bg-neutral-200 transition-all duration-200 ease-in-out">
                                    <summary className="ml-8" onClick={() => handleChangeNavigation(u)}>
                                        <NotebookText className="inline-block mr-2" />
                                        {u.title}
                                    </summary>
                                    
                                    
                                    {
                                        lessons.filter((lessons) => lessons.unit_id === u.unit_id)
                                        .sort((a, b) => a.order_by - b.order_by)        
                                        .map((l,i) => (
                                        <div key={l.lesson_id} 
                                            onClick={() => handleChangeNavigation( l)} 
                                            className="text-md flex flex-row gap-4 ml-12 mb-2 mt-2 p-2 hover:bg-neutral-300 transition-all duration-200 ease-in-out"> 
                                                <BookOpen className="inline-block mr-2" />
                                                {l.title}
                                            </div>
                                        )) 
                                    }

                                </details>
                               )) 
                            }
                           
                        </div>
                </details>

                ))}
                
                </div>
                
    </div>
  );
}
export default CoursesNavigation;