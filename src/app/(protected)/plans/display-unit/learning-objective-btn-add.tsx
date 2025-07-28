import { CurrentLessonAtom, CurrentUnitAtom, LearningObjectivesAtom, LOLessonsMapsAtom, UnitsAtom } from "@/atoms"
import { Button } from "@/components/ui/button"
import { useAtom, useAtomValue } from "jotai"
import { CirclePlus } from "lucide-react"
import { startTransition, useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import { addLearningObjective } from "@/actions/learning_objectives/addLearningObjective"
import { LearningObjectives } from "@/actions/learning_objectives/types"
import { createNewLearningObjective } from "./learning-objective-create-new";
import { Unit } from "@/actions/units/types"




const AddLearningObjectiveBtn = ({unit}: {unit: Unit}) => {
  

  // being set by DisplayCourses before seting the display mode
  const [currentLesson, setCurrentLesson] = useAtom(CurrentLessonAtom);
  
  const [learningObjectives, setLearningObjectives] = useAtom(LearningObjectivesAtom);
  const [loLesonsMaps, setLoLessonsMaps] = useAtom(LOLessonsMapsAtom);

  const [dlgOpen, setDlgOpen] = useState<boolean>(false);

  const [stateLOs, addLOToDB, isLoading] = useActionState(addLearningObjective, {data:null, error: null});
  
  const units = useAtom(UnitsAtom);
  
  const handleSave = () => {
    
    // update the client UI
    // call the server update

    const newLearningObjective = createNewLearningObjective(unit!.unit_id, learningObjectives!);
    
    //console.log("Adding learning objective", newLearningObjective);
    
    /* Add a New Course */
    setLearningObjectives(prev => [...prev, newLearningObjective!]);
    //console.log("Lessons", learningObjectives);

    // update the server
    startTransition(()=>{
      addLOToDB(newLearningObjective!);
    })
    
  };

  useEffect(()=>{
    
    // ignore the forst load.
    if ((stateLOs.data === null && stateLOs.error === null))
      return;

    if (stateLOs.error){

      console.error("addLearningObjectives Error", stateLOs.error, learningObjectives);
      // return correct state in 
      setLearningObjectives(stateLOs.data as LearningObjectives);

      toast.error(`Error!: ${stateLOs.error}`, {
        className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
      });

      return;
    } 
      
    toast.success("Update saved")
  
  },[stateLOs]);



  const handleLOsSelected = (selectedLOs: string[]) => {
    //console.log("Selected Learning Objectives:", selectedLOs);

    if (!currentLesson?.lesson_id) {
      console.error("No current lesson id available");
      return;
    }

    // remove the LO's for the lesson from mapped LOs Atom
    setLoLessonsMaps((prev) => [
      ...prev?.filter((lom) => lom.lesson_id !== currentLesson.lesson_id),
      ...selectedLOs?.map((loId) => ({
        type: "learning_objective_map", 
        lesson_id: currentLesson.lesson_id,
        learning_objective_id: loId,
      })),
    ]);
  };

  return <>
    <Button 
      variant="ghost" 
      className="hover:bg-white cursor-pointer hover:border-[0.5px] hover:border-slate-300 hover:shadow" 
      onClick={handleSave}
    >
      Add Learning Objective<CirclePlus size="18"/>
    </Button>
      
    </>
    
  }

export default AddLearningObjectiveBtn;