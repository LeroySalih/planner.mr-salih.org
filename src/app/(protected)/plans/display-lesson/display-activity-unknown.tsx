import { DisplayActivityProps } from "./types"

export const DisplayActivityUnknown = ({activity, editing}: DisplayActivityProps) => {

  return <div>Unknown: {activity.type}</div>
}