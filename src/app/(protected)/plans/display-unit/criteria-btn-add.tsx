import { CriteriasAtom, CurrentUnitAtom, LearningObjectivesAtom, UnitsAtom } from "@/atoms"
import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"

import { useAtom, useAtomValue } from "jotai"
import { startTransition, useActionState, useEffect } from "react"
import { toast } from "sonner"

import { addCriteria } from "@/actions/criteria/addCriteria"
import { Criterias } from "@/actions/criteria/types"
import { LearningObjective } from "@/actions/learning_objectives/types"
import { createNewCriteria } from "./criteria-create-new"

type AddCriteriaBtnProps = {
  lo: LearningObjective
}
const AddCriteriaBtn = ({lo}: AddCriteriaBtnProps) => {
  

  // being set by DisplayCourses before seting the display mode
  const currentUnit = useAtomValue(CurrentUnitAtom);

  const [learningObjectives, setLearningObjectives] = useAtom(LearningObjectivesAtom);
  const [criterias, setCriterias] = useAtom(CriteriasAtom);
  
  const [stateAddCriteria, addCriteriaToDB, isLoading] = useActionState(addCriteria, {data:null, error: null});
  
  const units = useAtom(UnitsAtom);
  
  const handleSave = () => {
    
    // update the client UI
    // call the server update

    const newCriteria = createNewCriteria(lo.learning_objective_id, criterias!);
    
    //console.log("Adding criteria", newCriteria, "to", criterias);
    
    /* Add a New Criteria */
    setCriterias(prev => [...prev, newCriteria!]);
    
    // update the server
    startTransition(()=>{
      addCriteriaToDB(newCriteria!);
    })
    
  };

  useEffect(()=>{
    
    // ignore the forst load.
    if ((stateAddCriteria.data === null && stateAddCriteria.error === null))
      return;

    if (stateAddCriteria.error){

      console.error("addCriteria Error", stateAddCriteria.error, criterias);
      // return correct state in 
      setCriterias(stateAddCriteria.data as Criterias);

      toast.error(`Error!: ${stateAddCriteria.error}`, {
        className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
      });

      return;
    } 
      
    toast.success("Update saved")
  
  },[stateAddCriteria])
  
  
  return <Button variant="ghost" onClick={handleSave}>
      <CirclePlus size="18"/>
    </Button>
    
  }

export default AddCriteriaBtn;


