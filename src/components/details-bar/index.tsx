
export type DetailsBarMode = 'course' | 'unit' | 'lesson'
 
const DetailsBar = ({mode}: {mode: DetailsBarMode}) => {

    // link to current Atoms 
    // mode is used to change displays

    return  <div className="bg-[_#d0ebff] h-full w-full p-4 rounded-tr-3xl rounded-br-3xl flex flex-col">
               
                <div className="w-[80%] ml-[10%] bg-white h-[200px] p-4 rounded-xl border-slate-300 border-2 shadow-xl mb-8">
                    <div className="font-bold border-b-2 border-slate-200 mb-2">Details Heading</div>
                    <div> Some data goes here</div>
                </div>

               
            </div>
}

export default DetailsBar;