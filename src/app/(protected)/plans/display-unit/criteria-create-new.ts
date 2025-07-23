import { Course, Courses } from "@/actions/courses/types";
import { Criteria, Criterias, CriteriaSchema } from "@/actions/criteria/types";

import {nextOrderBy} from "../../../../lib/next-order-by"
import { v4 as uuidv4 } from 'uuid';

export const createNewCriteria = (learning_objective_id: string, criteria: Criterias):Criteria => {
    
  const order_by = nextOrderBy<Criteria>(criteria);
  console.log("order_by", order_by);

  return CriteriaSchema.parse({
  criteria_id: uuidv4(),
  title: `I can ${criteria.filter(c => c.learning_objective_id === learning_objective_id).length + 1}`,
  order_by ,
  learning_objective_id,
  created: new Date(),
  active: true,
  created_by: "auto",
});
  }