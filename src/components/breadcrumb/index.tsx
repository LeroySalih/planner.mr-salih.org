import { CurrentCourseAtom, CurrentUnitAtom, PlanningDisplayModeAtom } from "@/atoms";
import { useAtom } from "jotai";


type BreadcrumbProps = {
    breadcrumbs: string[]
}


const Breadcrumb = ({ breadcrumbs }: BreadcrumbProps) => {

    const [currentUnit, setCurrentUnit] = useAtom(CurrentUnitAtom);
    const [currentCourse, setCurrentCourse] = useAtom(CurrentCourseAtom);
    const [planningDisplayMode, setPlanningDisplayMode] = useAtom(PlanningDisplayModeAtom);
    
    const handleCourseClick = () => {
        // Logic to handle course click, e.g., navigate to course page
        setPlanningDisplayMode("courses");
    }

    const handleUnitClick = () => {
        // Logic to handle course click, e.g., navigate to course page
        setPlanningDisplayMode("units")
        console.log("Unit clicked:", breadcrumbs[0]);
    }

    return (
        <div className="flex flex-row items-center gap-2 p-4 bg-neutral-100 rounded-lg shadow-md">
            
            {
                breadcrumbs[0] && <div onClick={handleCourseClick}>{breadcrumbs[0]}</div>
            }
            {
                breadcrumbs[1] && <div onClick={handleUnitClick}>
                                    &gt; {breadcrumbs[1]}
                                </div>
            }
            
               
            
        </div>
    )
}



export default Breadcrumb;