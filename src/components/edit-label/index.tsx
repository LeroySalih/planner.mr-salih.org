"use client"

import {useEffect, useRef, useState} from "react";
import {Pencil} from "lucide-react";
import {Input} from "@/components/ui/input";
import EditInput from "@/components/edit-label";



const defaultDisplayStyle = "text-black";
const defaultEditStyle = "text-black";

type EditLabelProps = {
     initialTitle: string, 
     onLabelChange:(label: string)=>void, 
     onClick: () => void,
     allowEdits?: boolean
     editClassName?: string, 
     displayClassName?: string
}

const EditLabel = ({
        initialTitle, 
        onLabelChange,
        onClick = () => {}, 
        editClassName = defaultEditStyle, 
        displayClassName = defaultDisplayStyle, 
        allowEdits = true}: EditLabelProps) => {

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [value, setValue] = useState<string>(initialTitle);
    
    const editLabel = useRef<HTMLInputElement>(null);
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        
        // if enter, update current current and parent
        if (event.key === 'Enter' ) {
          ////console.log('Enter key pressed!');
          setIsEditing(false);
          onLabelChange(value);
        }

        // if escape, revert
        if (event.key === 'Escape') {
          ////console.log('Enter key pressed!');
          setIsEditing(false);
          setValue(initialTitle);
          //onLabelChange(value);
        }


      };

    const handleOnEdit = () => {
        setIsEditing(true);
        editLabel.current?.focus();
        editLabel.current?.select();
    }

    const handleEditEnd = () => {
        setIsEditing(false);
        // user clicked away, so revert
        setValue(initialTitle)
    }

    const handleOnClick = () => {
       onClick && onClick();
    }

    useEffect(()=>{
        setValue(initialTitle)
    }, [initialTitle])

    // ✅ Focus and select when input is rendered
  useEffect(() => {
    if (isEditing) {
      const timer = setTimeout(() => {
        editLabel.current?.focus();
        editLabel.current?.select();
        //console.log("Setting focus", editLabel.current)
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);


    if (!isEditing){
        return <div className="flex flex-row items-center relative group">
            <div onClick={handleOnClick} className={`${displayClassName} flex flex-row mr-4 `}>{value}</div>
            {allowEdits && <Pencil size="18" className="opacity-0 group-hover:opacity-100 cursor-pointer"  onClick={handleOnEdit}/>}
            </div>
    }

    return <div className="relative group">
        <Input className={editClassName} 
                ref={editLabel}
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                onKeyDown={handleKeyDown} 
                onBlur={handleEditEnd}/>
        </div>
    
}



export default EditLabel;