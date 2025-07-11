import { Activity } from "@/actions/activities/types"

export type DisplayActivityProps = {
  activity: Activity,
  editing: boolean | null,
  onEditingEnd: (a: Activity)=>void
}