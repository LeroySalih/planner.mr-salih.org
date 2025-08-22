import { getLessons } from "@/actions/lessons/getLessons";
import { LessonEditor } from "./editor";

const JotaiPage = async () => {


    const {data: lessons, error} = await getLessons()

    return <div>
        <div>Jotai Test Page</div>
        {lessons && lessons.length > 1 && <LessonEditor initial={lessons[0]}/>}
        <div><pre>{JSON.stringify(lessons, null, 2)}</pre></div>
    </div>
}

export default JotaiPage;