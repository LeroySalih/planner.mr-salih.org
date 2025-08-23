"use client"

import { PointerEventHandler, startTransition, useActionState, useEffect, useState } from "react"
import { Reorder, sync, useDragControls } from "framer-motion"
import { GripVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lesson, Lessons } from "@/actions/lessons/types"
import { init } from "next/dist/compiled/webpack/webpack"
import EditLabel from "@/components/edit-label"
import DeleteLessonButton from "./lesson-btn-delete"
import { useAtom } from "jotai"
import { updateLesson } from "@/actions/lessons/updateLesson"
import { CurrentDetailsObjectAtom, LearningObjectivesAtom, LessonsAtom, LOLessonsMapsAtom, UnitsAtom } from "@/atoms"
import { toast } from "sonner"
import MultiSelectCheckboxes from "@/components/multiselect"
import { Unit } from "@/actions/units/types"
import AddLessonBtn from "./lesson-btn-add"
import { syncLOLessonMap } from "@/actions/learning-objectives-lessons-map/syncLOLessonMap"



interface LessonListProps {
  initialLessons: Lesson[]
  onReorderComplete?: (lessons: Lesson[]) => void
}

interface LessonItemProps {
index: number,
  lesson: Lesson
  onDragStart: () => void
  onDragEnd: () => void
}

function LessonItem({ index, lesson, onDragStart, onDragEnd }: LessonItemProps) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      key={lesson.lesson_id}
      value={lesson}
      dragListener={false}
      dragControls={dragControls}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      

        <DisplayLesson index={index} lesson={lesson} onDragStart={(e) => dragControls.start(e)}  />
    </Reorder.Item>
  )
}

export default function LessonList({ initialLessons, onReorderComplete }: LessonListProps) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [isDragging, setIsDragging] = useState(false)

  const handleReorder = (newLessons: Lesson[]) => {
    setLessons(newLessons)
    // Only notify parent when dragging ends
    if (!isDragging && onReorderComplete) {
      onReorderComplete(newLessons)
    }
  }

  useEffect(() => {
    setLessons(initialLessons);
  },[initialLessons]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      
      <Reorder.Group axis="y" values={lessons} onReorder={handleReorder} className="space-y-3">
        {lessons.map((lesson:Lesson, index:number) => (
          <LessonItem
            index={index}
            key={lesson.lesson_id}
            lesson={lesson}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
              setIsDragging(false)
              if (onReorderComplete) {
                onReorderComplete(lessons)
              }
            }}
          />
        ))}
      </Reorder.Group>
      <p className="text-sm text-muted-foreground mt-6 text-center">Drag the grip icon to reorder lessons</p>
    </div>
  )
}


const DisplayLesson = ({index, lesson, onDragStart}: {index: number,  lesson:Lesson, onDragStart:PointerEventHandler<HTMLDivElement> }) => {

  const [stateLesson, updateLessonToDB, isLoading] = useActionState(updateLesson, {data:null, error: null});
  const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);
  const [lessons, setLessons] = useAtom(LessonsAtom);
  const [loLessonMaps, setLoLessonMaps] = useAtom(LOLessonsMapsAtom);

  const [learningObjectives, setLearningObjectives] = useAtom(LearningObjectivesAtom);
  const [units, setUnits] = useAtom(UnitsAtom);
  const [parentUnit, setParentUnit] = useState<Unit | null>(null);
  
  const [stateSyncLO, syncLO, isUpdatingLO] = useActionState(syncLOLessonMap, {data:null, error: null});
  useEffect(()=>{

    const newUnit = units.find(u => u.unit_id == lesson.unit_id);
    
    setParentUnit(newUnit!);

  }, [lesson]);

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

  const handleLOAddedToLesson = (selectedValues: string[]) => {

    //console.log("Adding", selectedValues, "to lesson", lesson.lesson_id);

    
    // remove all LO for this lesson from the UI
    //console.log(loLessonMaps.length, "existing LO Lesson Maps");
    const newloLessonMap =loLessonMaps.filter((loMap) => loMap.lesson_id !== lesson.lesson_id)
    
    
    // add to the UI
    selectedValues.forEach((loId) => {
        newloLessonMap.push({
            type: "learning_objective_lesson_map",
            learning_objective_id: loId,
            lesson_id: lesson.lesson_id
        });
    });


    // update the UI optimistically
    setLoLessonMaps(newloLessonMap);   
    
    // I need to update the server
    const serverUpdate = selectedValues.map(s => ({
      type: "learning_objective_lesson_map",
      learning_objective_id: s,
      lesson_id: lesson.lesson_id
    }));

    
    startTransition(() => {
      //console.log("Syncing LO Lesson Map to server", serverUpdate);
      syncLO({
        lessonId: lesson.lesson_id, 
        loLessonMaps: serverUpdate
      });
    });

  };

  return <>
  <div className="flex flex-col items-center m-2 gap-2  group  ">
    

    <div className="flex flex-row items-center gap-2 w-full">
        <div onPointerDown={onDragStart} className="flex flex-row cursor-grab text-sm relative w-6 h-6  text-[8pt] font-sans  border-2 border-blue-500 rounded-full text-black justify-center items-center">
            {index + 1}
        </div>
        <div className="text-black text-sm font-normal flex flex-row group items-center">
            <EditLabel initialTitle={lesson.title} onClick={()=>handleLessonClick(lesson)} onLabelChange={handleLabelChange} />
            <div className=" group-hover:opacity-100 transition-opacity duration-200 ease-in-out
             rounded ml-2"><DeleteLessonButton lesson={lesson}/> </div>
            <div className=" group-hover:opacity-100 transition-opacity duration-200 ease-in-out rounded ml-2">
                
                <MultiSelectCheckboxes 
                    options={learningObjectives.filter(lo => lo.unit_id == parentUnit?.unit_id).map(lo => ({id: lo.learning_objective_id, value: lo.learning_objective_id,  label: lo.title}))    }
                    onSelectionChange={handleLOAddedToLesson}    
                    initialValues={loLessonMaps.filter((lom) => lom.lesson_id === lesson.lesson_id).map(lom => lom.learning_objective_id)}
                    
                />
            </div>
        </div>
   </div>
   
  </div>
  <div className="flex flex-col">
       
        {
            loLessonMaps.filter((loMap) => loMap.lesson_id === lesson.lesson_id)
            .map((loMap) => {
                const lo = learningObjectives.find((l) => l.learning_objective_id === loMap.learning_objective_id);
                return (
                    <div key={loMap.learning_objective_id} >
                        {lo ? <span className="text-[11px] text-neutral-500 ml-9">&bull; {lo.title}</span> : "Unknown LO"}
                    </div>
                )
            })
        }

       
    </div>
    </>
}
