import { Activities, Activity } from "@/actions/activities/types";
import { Checkbox } from "@/components/ui/checkbox";
import { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";



import { DisplayActivityText } from './display-activity-text';
import DisplayActivityKeywords from "./display-activity-keyword";
import DisplayActivityVideo from "./display-activity-video";
import { updateActivity } from "@/actions/activities/updateActivity";
import { useAtom } from "jotai";
import { ActivitiesAtom } from "@/atoms";
import { DisplayActivityUnknown } from "./display-activity-unknown";
import DisplayActivityImages from "./display-activity-images";


export const DisplayActivity = ({activity}: {activity: Activity}) => {

  const [state, updateActivityInDB, isPending] = useActionState(updateActivity, {data: null, error: null});
  const [activities, setActivities] = useAtom(ActivitiesAtom);

  const [editing, setEditing] = useState<boolean | null>(null);

  const handleEditingEnd = (newActivity: Activity) => {
    
    setEditing (false)
    
    // write the actiivty to UI
    const newActivities = activities.map((a) => a.activity_id === newActivity.activity_id ? newActivity : a)
    
    console.log("New Activities", newActivity, newActivities);

    setActivities(newActivities);

    // save to DB
    startTransition(()=>{
      updateActivityInDB(newActivity);
    })
  }
  
  const handleEditingClick = () => {
    setEditing(!editing)
  }


  const displayActivitySwitch = (activity: Activity, editing: boolean | null) => {

    switch (activity.activity_type) {
      case "keywords" : return <DisplayActivityKeywords activity={activity} editing={editing} onEditingEnd={handleEditingEnd}/>
      case "text" : return <DisplayActivityText activity={activity} editing={editing} onEditingEnd={handleEditingEnd}/>
      case "video" : return <DisplayActivityVideo activity={activity} editing={editing} onEditingEnd={handleEditingEnd}/>
      case "images" : return <DisplayActivityImages activity={activity} editing={editing} onEditingEnd={handleEditingEnd} />
      default: return <DisplayActivityUnknown activity={activity} editing={editing} onEditingEnd={handleEditingEnd}/>
    }
}

useEffect(()=>{

        // ignore the forst load.
        if ((state.data === null && state.error === null))
        return;

        if (state.error){
            console.log("Add Unit Error", state.error);
            // return correct state in 
            setActivities(state.data as Activities);

            toast.error(`Error!: ${state.error}`, {
            className: "bg-red-100 text-green-800 border border-green-300 font-semibold",
            });

      return;
    }
    
    toast("Activity Updated");
    
    }, [state])

 

  return <div className="border-neutral-400 border-[1px] m-4 p-2 rounded-lg">
    <div>
      {activity.title}
      <Checkbox checked={editing || false} onClick={handleEditingClick}/>
    </div>
    {displayActivitySwitch(activity, editing)}
    </div>
}