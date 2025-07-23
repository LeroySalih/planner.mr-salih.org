import { ActivitiesAtom, CriteriasAtom, CurrentUnitAtom, LearningObjectivesAtom, UnitsAtom } from "@/atoms"
import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"

import { useAtom, useAtomValue } from "jotai"
import { startTransition, useActionState, useEffect } from "react"
import { toast } from "sonner"

import { addCriteria } from "@/actions/criteria/addCriteria"
import { Criterias } from "@/actions/criteria/types"
import { LearningObjective } from "@/actions/learning_objectives/types"
import { createNewActivity } from "./activity-create-new"
import { Lesson } from "@/actions/lessons/types"
import { updateActivity } from "@/actions/activities/updateActivity"
import { addActivity } from "@/actions/activities/addActivity"
import { Activities } from "@/actions/activities/types"

type AddActivityBtnProps = {
  lesson: Lesson
}

const AddActivityBtn = ({lesson}: AddActivityBtnProps) => {
  

  const [activities, setActivities] = useAtom(ActivitiesAtom);
  
  const [stateAddCriteria, addActivityToDB, isLoading] = useActionState(addActivity, {data:null, error: null});
  

  const handleSave = () => {
    
    // update the client UI
    // call the server update

    const newActivity = createNewActivity(lesson.lesson_id, activities);
    
    /* Add a New Criteria */
    setActivities(prev => [...prev, newActivity!]);
    
    // update the server
    startTransition(()=>{
      addActivityToDB(newActivity!);
    })
    
  };

  useEffect(()=>{
    
    // ignore the forst load.
    if ((stateAddCriteria.data === null && stateAddCriteria.error === null))
      return;

    if (stateAddCriteria.error){

      //console.error("addCriteria Error", stateAddCriteria.error, activities);
      
      // return correct state in 
      setActivities(stateAddCriteria.data as Activities);

      toast.error(`Error!: ${stateAddCriteria.error}`, {
        className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
      });

      return;
    } 
      
    toast.success("Update saved")
  
  },[stateAddCriteria])
  
  
  return <Button variant="ghost" onClick={handleSave}>
      <CirclePlus size="18"/> Add Activity
    </Button>
    
  }

export default AddActivityBtn;


