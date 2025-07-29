import { use, useEffect, useState } from "react";
import { DisplayActivityProps } from "./types";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { listFilesForActivity } from "@/actions/files/listFilesForActivity";
import UrlManager from "@/components/url-manager";
import type { UrlObject } from "@/components/url-manager";
import { Activity } from "@/actions/activities/types";
import { ChevronsRightLeft } from "lucide-react";







const DisplayActivitiesImages = ({activity, editing, onEditingEnd}: DisplayActivityProps) => {

  const aId = activity.activity_id;
  const DOWNLOAD_PATH = `/api/activity/${aId}`;
  

  const imageUrls = activity?.body?.images?.map((i: {id: number, original: string, thumbnail: string}, index: number) => ({id: index, original:`${DOWNLOAD_PATH}/${i.original}`, thumbnail: `${DOWNLOAD_PATH}/${i.thumbnail}`}))

  return <div>Images
    <div className=" w-full">
      { editing ? <DisplayEditFiles activity={activity} onEditingEnd={onEditingEnd}/> : <ImageGallery items={imageUrls || []} />}
    </div>
    </div>

}


export default DisplayActivitiesImages;


const DisplayEditFiles = ({activity, onEditingEnd}: {activity: Activity, onEditingEnd: (a: Activity)=> void}) => {

  const aId = activity.activity_id;
  const DOWNLOAD_PATH = `/api/activity/${aId}`;

  const [paths, setPaths] = useState<UrlObject[]> ([]);

  useEffect(()=>{

    //console.log("setting paths for activity", activity);
    const imagePaths = activity?.body?.images?.map((i: {id: number, original: string, thumbnail: string}, index: number) => ({id: index, original:`${DOWNLOAD_PATH}/${i.original}`, thumbnail: `${DOWNLOAD_PATH}/${i.thumbnail}`}))

    //console.log("Image Paths:", imagePaths);
    setPaths(imagePaths || []);

  }, [activity])

  

  return <div>

    {activity && <UrlManager activity={activity}  onEditingEnd={onEditingEnd}/>}
  
    {/* Implement file upload/editing functionality here */}
  </div>;
}