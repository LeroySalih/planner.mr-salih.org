import { Course, Courses } from "@/actions/courses/types";
import { LearningObjective, LearningObjectives, LearningObjectiveSchema } from "@/actions/learning_objectives/types";
import { v4 as uuidv4 } from 'uuid';

const nextOrderBy = ( los: LearningObjectives) : number => {
    if (los.length == 0 || los === null)
      return 0;

    return (los.sort((a, b) => (b.order_by || 0) - (a.order_by || 0))[0].order_by || 0) + 1
}

export const createNewLearningObjective = (unit_id: string, los: LearningObjectives):LearningObjective => {
    return  LearningObjectiveSchema.parse({
    learning_objective_id: uuidv4(),
    title: `TBAT New LO ${los.filter(lo => lo.unit_id === unit_id).length + 1}`,
    order_by: nextOrderBy(los),
    unit_id,
    created: new Date(),
    tags: [],
    active: true,
    created_by: "auto",
  });
  }