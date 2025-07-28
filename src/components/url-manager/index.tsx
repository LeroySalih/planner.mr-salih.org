"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import AddUrlForm from "./add-url-form"
import UrlList from "./url-list"
import { Activity } from "@/actions/activities/types"
import { ActivitiesAtom } from "@/atoms"
import { useAtom } from "jotai"
import { set } from "zod"
import { toast } from "sonner"

export interface UrlObject {
  id: number
  original: string
  thumbnail: string
}

interface UrlManagerProps {
  activity: Activity,
  initialUrls?: UrlObject[]
  onEditingEnd?: (activity: Activity) => void
}


export default function UrlManager({ activity:initialActivity, onEditingEnd }: UrlManagerProps) {
  
  const [activity, setActivity] = useState<Activity>(initialActivity);
  const [urls, setUrls] = useState<UrlObject[] | null>(null);

  const [activities, setActivities] = useAtom(ActivitiesAtom);
  

  const convertFileNameToUrls = (paths: UrlObject[]) => {
    
    //console.log("convertToUrls::", paths);

    if (!paths || paths.length === 0) {
      return [];
    }
    
    return paths.map((path, index) => ({
      id: index,
      original: `path`,
      thumbnail: path,
    } as unknown as UrlObject));
  }

  useEffect(() => {
    
    //console.log("Setting initial URLs:", initialActivity?.body?.images);

    setUrls(initialActivity?.body?.images ?  initialActivity?.body?.images : []);
    
    setActivity(initialActivity);

  },[initialActivity]);

    useEffect(() => {
    
    //console.log("Setting initial URLs:", initialActivity?.body?.images);

      setUrls(activity?.body?.images ?  activity?.body?.images : []);
    
      setActivity(activity);

    },[activity]);

  

  const updateUrls = (newUrls: UrlObject[]) => {

    setUrls(newUrls);

    const newActivity = Object.assign({}, activity, {body: {...activity.body, images: newUrls}});

    //console.log("New Activity Image URLs:", newActivity);
    setActivity(newActivity);
    onEditingEnd?.(newActivity);
  
  }

  const uploadFiles = async (acceptedFiles: File[]) => {

    let result: {data: null | Activity, error: null | string} = {data: null, error: null};

    try{
      const formData = new FormData()

      const activityId = activity.activity_id // Assuming activity_id is available in the activity object
      formData.append('activity_id', activityId) // Include activity ID

      acceptedFiles.forEach((file) => {
        formData.append('files', file)
      })
      
      const res = await fetch(`/api/activity/`, {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = (await res.json()).data;

        //console.log('Upload successful :: data', data);
        result.data = data as Activity;
        

      } else {
        throw new Error((await res.json()).error)
      }
    } catch(err) {
      result.error = (err as unknown as Error).message;
    } finally {

      return result;
    }
    
  }

  const handleAddFiles = async (newFiles: File[]) => {

    //console.log("handleAddFiles::pre", newFiles);
    
    const result = await uploadFiles(newFiles) // Call uploadFiles if needed

    if (result.data === null) {
      console.error("Error uploading files:", result.error);
      toast.error("Error uploading files: " , {
        description: result.error,
        duration: 5000
      });
      return;
    }

    toast.success("Files uploaded successfully", {
          description: "Your files have been uploaded and URLs updated.",
          duration: 3000});

    // get the newActivity from the result
    const newActivity = result.data;
    //console.log("handleAddFiles:: newActivity::", newActivity)

    // update activities UI
    const newActivities = activities.map((a) => {
      return a.activity_id === activity.activity_id ? newActivity : a
    }) ;

    setActivity(newActivity);
    setActivities(newActivities);

  }

  const handleRemoveUrl = (id: number) => {
    if (!urls)
      return;

    updateUrls(urls.filter((url) => url.id !== id))
  }

  const handleReorderUrls = (newUrls: UrlObject[]) => {
    updateUrls(newUrls)
  }



  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">URL Manager</h2>
        <p className="text-muted-foreground">Add, remove, and reorder your URLs. Drag and drop to change the order.</p>
      </div>

      {/* Add URL Form */}
      <AddUrlForm onAddFiles={handleAddFiles} />

      <div>urls:</div>
      <pre>{JSON.stringify(urls, null, 2)}</pre>

      {/* URL List */}
      { activity &&  <UrlList activity={activity} onRemoveUrl={handleRemoveUrl} onReorderUrls={handleReorderUrls} />}

      {/* Summary */} 
      {urls && urls.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              Total URLs: <span className="font-medium text-foreground">{urls.length}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
