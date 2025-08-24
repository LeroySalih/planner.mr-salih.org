import { LearningObjective } from "@/actions/learning_objectives/types";
import { CriteriasAtom } from "@/atoms";
import { useAtom} from "jotai";
import { LOLessonsMapsAtom } from "@/atoms";
import { LearningObjectivesAtom } from "@/atoms";
import { LearningObjectives } from "@/actions/learning_objectives/types";
import { useEffect, useActionState, startTransition } from "react";
import { updateLearningObjective } from "@/actions/learning_objectives/updateLearningObjective";
import { toast } from "sonner";
import EditLabel from "@/components/edit-label"; 
import {DisplayCriteria} from "./display-criteria";
import AddCriteriaBtn from "./criteria-btn-add";
import DeleteLearningObjectiveButton from "./learning-objective-btn-delete";
import {useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import SortableList, { DragHandle } from '@/components/dnd-list';
import { Unit, Units } from '@/actions/units/types';
import { CurrentDetailsObjectAtom } from '@/atoms';



export default function LOList(
  {initial, onReorder}: 
  {initial: Unit, 
   onReorder: (los: LearningObjectives)=> void}
  ) {

  const [learningObjectives, setLearningObjectives] = useAtom(LearningObjectivesAtom);  
  
  const [los, setLOs] = useState<LearningObjectives >([]);
  const [currentDetailsObject, setCurrentDetailsObject] = useAtom(CurrentDetailsObjectAtom);

  
  useEffect(()=> {
    
    const newLOs = learningObjectives.filter((lo)=>lo.unit_id == initial.unit_id);

    setLOs(newLOs);

  }, [initial]);

  const handleReorder =(newOrder: string[]) => {

    const newLOs = newOrder.map((id) => los.find((lo) => lo.learning_objective_id === id))
      .map((item, i) => ({...item, order_by: i}))
      .filter((x): x is LearningObjective => Boolean(x)
    );

    setLOs(newLOs);

    onReorder && onReorder(newLOs);

  }

  

  return (
    <SortableList
      onReorder={handleReorder}
    >
      {los && los.sort((a, b) => a.order_by - b.order_by)
          .map((item, index) => (
        <div
          key={item.learning_objective_id}
          data-id={item.learning_objective_id}  
          className="flex items-center gap-3 rounded-xl border p-3"
        >
          {/* The tiny handle — only this area starts the drag */}
          <DragHandle className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-neutral-100">
            {/* You can put any icon here */}
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="7" cy="6" r="1.8" /><circle cx="12" cy="6" r="1.8" /><circle cx="17" cy="6" r="1.8" />
              <circle cx="7" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="17" cy="12" r="1.8" />
            </svg>
          </DragHandle>

          <div className="grow">
            <div className="font-medium">
              <DisplayLearningObjective lo={item} index={index}/>
            </div>
            
          </div>
        </div>
      ))}
    </SortableList>
  );
}



export const DisplayLearningObjectives = ({unit_id}: {unit_id: string}) => {

  const [learningObjectives, setLearningObjectives] = useAtom(LearningObjectivesAtom);
  const [losForUnit, setLosForUnit] = useState<LearningObjectives | null>(null);

  useEffect(()=>{

    const los = learningObjectives.filter((lo) => lo.unit_id == unit_id);

    setLosForUnit(los);

  },[learningObjectives,unit_id]);

  return <div>{ losForUnit && losForUnit
                  .sort((a,b) => a.order_by - b.order_by)
                  .map((lo, index) => {
                      return <DisplayLearningObjective key={lo.learning_objective_id || uuidv4()} index={index} lo={lo}/>
                      
                    })  
                }
          </div>
}



export const DisplayLearningObjective = ({lo, index}:{lo:LearningObjective, index:number}) => {
  
  const [criterias, setCriterias] = useAtom(CriteriasAtom);
  const [loLesonsMaps, setLOLessonsMaps] = useAtom(LOLessonsMapsAtom);

  const [learningObjectives, setLearningObjectives] = useAtom<LearningObjectives>(LearningObjectivesAtom);
  const [stateLO, updateLOToDB, isLoading] = useActionState(updateLearningObjective, {data:null, error: null});

  const handleLabelChange = (newTitle: string) => {
    // Optimistic Update UI
    const updatedLO = { ...lo, title: newTitle } as LearningObjective;
    // Update the learning objective title in the UI
    setLearningObjectives(prev =>
        prev.map(c => c?.learning_objective_id === lo?.learning_objective_id ? updatedLO : c)
    );  

    startTransition(()=>{
      updateLOToDB(updatedLO!);
    }
    );  


  }

  useEffect(()=>{
    // ignore the forst load.
    if ((stateLO.data === null && stateLO.error === null))
      return;

    if (stateLO.error){

      // return correct state in 
      setLearningObjectives(stateLO.data as LearningObjectives);

      toast.error(`Error!: ${stateLO.error}`, {
        className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
      });
      return;
    } 

    toast.success("Update saved");
  }, [stateLO])

  return (<div key={index} className="m-4 p-4  cursor-pointer rounded-lg relative hover:bg-neutral-50 transition-all duration-200 ease-in-out">
              <div className="flex flex-row items-center justify-between mb-2">
                <div className="font-bold flex flex-row items-center group">
                  <EditLabel initialTitle={lo.title} 
                    onLabelChange={handleLabelChange} 
                    onClick={()=>{} }
                    allowEditOnClick={true}/>
                  <div className="group-hover:opacity-100 transition-opacity duration-200 ease-in-out"><DeleteLearningObjectiveButton lo={lo} /></div>
                  <div className="group-hover:opacity-100 transition-opacity duration-200 ease-in-out"><AddCriteriaBtn lo={lo} /></div>
                </div>
                <div className="text-[8pt] border-[0.5] border-neutral-300 bg-neutral-100 px-2 rounded-full ">
                  {loLesonsMaps.filter(lom => lom.learning_objective_id === lo.learning_objective_id && lo.active).length} 
                  &nbsp;Lessons</div>

                
              </div>
              
              {
                criterias
                  .filter(c => c.learning_objective_id === lo.learning_objective_id)
                  .sort((a, b) => a.order_by - b.order_by)
                  .map((criteria, j) => (
                    <div key={criteria.criteria_id} className="ml-4 text-sm text-gray-600 relative group">
                      <DisplayCriteria criteria={criteria} />
                    </div>
                  ))
              }
            </div>)
}