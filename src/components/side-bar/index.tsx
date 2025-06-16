import { ListTodo } from "lucide-react";
import { Folders } from "lucide-react";
import { Folder } from "lucide-react";
import { File } from "lucide-react";
import { Settings } from "lucide-react"; 

const SideBar = ({onSelect}:{onSelect: (display: string)=>void}) => {
    return <div className="flex justify-center flex-col h-full w-[100px] items-center space-between bg-neutral-200 border-r-2 border-neutral-200">

           <ListTodo size="44" className="m-4 cursor-pointer"/>
           <Folders size="44"  className="m-4 cursor-pointer" onClick={()=>onSelect("courses")}/>
           <Folder size="44" className="m-4 cursor-pointer" onClick={()=>{onSelect("units")}}/>
           <File size="44" className="m-4 cursor-pointer" onClick={()=>{onSelect("lessons")}} />
           <div className="flex-grow"></div>
           <Settings size="44" className="m-4 cursor-pointer"/>
    </div>
}


export default SideBar;