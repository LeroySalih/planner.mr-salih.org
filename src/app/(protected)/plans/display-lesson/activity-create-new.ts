import { Activities, Activity, ActivitySchema } from "@/actions/activities/types";
import { Course, Courses } from "@/actions/courses/types";
import { Criteria, Criterias, CriteriaSchema } from "@/actions/criteria/types";
import { ActivitiesAtom } from "@/atoms";

import {nextOrderBy} from "@/lib/next-order-by"
import { useAtom } from "jotai";
import { v4 as uuidv4 } from 'uuid';

export const createNewActivity = (lesson_id: string, activities: Activities):Activity => {
    
  
  
  const order_by = nextOrderBy<Activity>(activities);

  return ActivitySchema.parse({
  activity_id: uuidv4(),
  lesson_id,
  activity_type: "text",
  body: {"html": "New Activity"},
  title: "new Activity",
  order_by ,
  created: new Date(),
  active: true,
  created_by: "auto",
});
  }