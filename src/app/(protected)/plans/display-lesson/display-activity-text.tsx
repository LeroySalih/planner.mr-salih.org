import Tiptap from "@/components/tip-tap";
import { useEffect, useState } from "react";
import { DisplayActivityProps } from "./types";

export const DisplayActivityText = ({activity, editing, onEditingEnd}: DisplayActivityProps) => {

  console.log("Activity", activity.body.html)

  const [content, setContent] = useState(activity.body.html);

  const handleOnEditingend = (newContentText: string) => {
    setContent(newContentText)

  } 

  useEffect(()=>{
    if (editing === false) {
        const newActivity = Object.assign({}, activity);
        newActivity.body.html = content;

         // notify parent of change
        onEditingEnd(newActivity);
    }
  },
  [editing])



  if (editing){
    return <Tiptap initialContent={content} onEditingEnd={handleOnEditingend}/>
  }

  return <div>
      <div>Text Activity</div>
      <div dangerouslySetInnerHTML={{__html: content}}></div> 
      
  </div>
}