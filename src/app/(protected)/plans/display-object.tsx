'use client';

import { Course } from '@/actions/courses/types';
import { Lesson } from '@/actions/lessons/types';
import { Unit } from '@/actions/units/types';
import { ReactNode } from 'react';
import DisplayLesson from './display-lesson';
import DisplayUnit from './display-unit';
import DisplayCourse from './display-course';
import { useAtom } from 'jotai';
import { CurrentDetailsObjectAtom } from '@/atoms';

interface DisplayObjectProps {
   
    
}

const DisplayObject = ({ }: DisplayObjectProps) => {

  const [displayObject, setDisplayObject] = useAtom(CurrentDetailsObjectAtom);
  return (
    <div className="h-full w-full p-4 bg-white-100 overflow-y-auto">
      
      {displayObject === null &&  (<div>No Object Loaded</div>)}
      { displayObject?.type === 'course'  && <DisplayCourse />}
      { displayObject?.type === 'unit'  && <DisplayUnit />}
      { displayObject?.type === 'lesson' && <DisplayLesson />}
     
    </div>
  );
};

export default DisplayObject;