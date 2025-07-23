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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { Plus, Trash2, ChevronUp, ChevronDown, Edit3, Save, X, Trash } from "lucide-react"
import { Button } from "@/components/ui/button";
import DeleteActivityButton from "./activity-btn-delete";
import EditLabel from "@/components/edit-label";

export const DisplayActivity = ({activity:initialActivity}: {activity: Activity}) => {

  const [state, updateActivityInDB, isPending] = useActionState(updateActivity, {data: null, error: null});
  const [activities, setActivities] = useAtom(ActivitiesAtom);

  const [activity, setActivity] = useState<Activity | null>(initialActivity);

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


useEffect(() => {
  if (editing === null) {
    return;
  }

  if (editing === false) {
    // if editing is false, we need to save the activity
    if (activity) {
      handleEditingEnd(activity);
    }
  }

},[editing]);

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

  const activityTypes = [
    {id: "keywords", label: "Keywords"},
    {id: "text", label: "Text"},
    {id: "video", label: "Video"},
    {id: "images", label: "Images"},

  ];

  const handleActivityTypeChange = (newActivityType: string) => {

    const newActivity = Object.assign({}, activity, {activity_type: newActivityType});
    
    setActivity(newActivity);

  }

  const handleLabelChange = (newTitle: string) => {
    const newActivity = Object.assign({}, activity, {title: newTitle});
    setActivity(newActivity);
  }

  const handleLabelOnClick = () => {}

  return <div className="border-neutral-400 border-[1px] m-4 p-2 rounded-lg">
    <div className="flex flex-row ">
      <div className="grow">

      {
        editing ? <EditLabel initialTitle={activity?.title || ""} onLabelChange={handleLabelChange} onClick={handleLabelOnClick}/> : <div>{activity?.title}</div> 
      }  
      
      </div>
      
      { editing && <div className="flex flex-row m-2 gap-2">
        <Select defaultValue={activity?.activity_type} 
          value={activity?.activity_type}
          onValueChange={handleActivityTypeChange}
          >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Activity Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Activity Types</SelectLabel>
              <SelectItem value="apple"></SelectItem>
              {
                activityTypes.map((a, i) => <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>)
              }
            </SelectGroup>
          </SelectContent>
      </Select>
      
      <Button variant="ghost" size="sm">
        <ChevronUp/>
      </Button>
      <Button variant="ghost" size="sm">
        <ChevronDown/>
      </Button>
      
      { activity && <DeleteActivityButton activity={activity}/> }
      
      </div>
}

      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" checked={editing || false} onCheckedChange={handleEditingClick}/>
        <Label htmlFor="airplane-mode">Editing</Label>
      </div>
    </div>
    {activity && displayActivitySwitch(activity, editing)}
    </div>
}