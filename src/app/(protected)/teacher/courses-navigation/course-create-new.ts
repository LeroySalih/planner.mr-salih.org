import { Course, Courses } from "@/actions/courses/types";
import { z } from "zod";
import { CourseSchema } from "@/actions/courses/types";

const nextOrderBy = (courses: Courses) : number => {
    if (courses.length == 0 || courses === null)
      return 0;

    return (courses.sort((a, b) => (b.order_by || 0) - (a.order_by || 0))[0].order_by || 0) + 1
}



export const createNewCourse = (courses: Courses):Course => {
    return CourseSchema.parse( {
      type: "course",
      course_id: crypto.randomUUID(),
      title: "New Course",
      nc_id: "",
      tags: [],
      nc_title: "",
      active: true,
      created: new Date(),
      created_by: "auto",
      order_by: nextOrderBy(courses)
    });
  }