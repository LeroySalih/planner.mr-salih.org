import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { DisplayActivityProps } from "./types";

const DisplayActivityVideo = ({activity, editing, onEditingEnd}: DisplayActivityProps) => {
  
  const url = activity.body.url;
  const [code, setCode] = useState<string | null>(url);
  
  const handleCodeChange= (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  }

  const handleCodeSave = () => {
    const newActivity = activity;
    newActivity.body.url = code;
    onEditingEnd(newActivity);
  }

  const handleCodeCancel = () => {
    onEditingEnd(activity);
  }

  if (editing) {
    return <div >

      <div>Enter video code</div>
      <div><Input value={code || "" } onChange={handleCodeChange}/></div>
      <div>
        <Button onClick={handleCodeSave}>Save</Button>
        <Button onClick={handleCodeCancel}>Cancel</Button>
      </div>

    </div>
  }

  return <div>
    <iframe width="560" height="315" src={`https://www.youtube.com/embed/${url}?si=RfeIycR56YI2yBaQ&amp;`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
  </div>
} 


export default DisplayActivityVideo;