import {useAtom} from "jotai";
import { CriteriasAtom } from "@/atoms";
import { startTransition, useEffect, useActionState} from "react";
import { updateCriteria } from "@/actions/criteria/updateCriteria";
import { toast} from "sonner";
import EditLabel from "@/components/edit-label";
import DeleteCriteriaButton from "./criteria-btn-delete";

export const DisplayCriteria = ({criteria}:{criteria: any}) => {
  
  const [criterias, setCriterias] = useAtom(CriteriasAtom);
  const [stateCriteria, updateCriteriaToDB, isLoading] = useActionState(updateCriteria, {data:null, error: null});
  
  const handleLabelChange = (newTitle: string) => {
    // Optimistic Update UI
    const updatedCriteria = { ...criteria, title: newTitle } as any;
    // Update the criteria title in the UI
    setCriterias(prev =>
        prev.map(c => c?.criteria_id === criteria?.criteria_id ? updatedCriteria : c)
    );

    startTransition(()=>{
      updateCriteriaToDB(updatedCriteria!);
    });
  } 

  useEffect(()=>{
    // ignore the forst load.
    if ((stateCriteria.data === null && stateCriteria.error === null))
      return;

    if (stateCriteria.error){

      // return correct state in 
      setCriterias(stateCriteria.data as any);

      toast.error(`Error!: ${stateCriteria.error}`, {
        className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
      });
      return;
    } 

    toast.success("Update saved");
  }, [stateCriteria]);  
  
  return (
    <div className="ml-4 text-sm text-gray-600 flex flex-row items-center gap-2 ">
      <div><EditLabel 
        initialTitle={criteria.title} 
        onClick={()=>{}} 
        onLabelChange={handleLabelChange} 
        allowEditOnClick={true}
        /></div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"><DeleteCriteriaButton criteria={criteria} /></div>
    </div>
  );
}


