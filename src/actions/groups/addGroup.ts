"use server"

import { getGroups } from "./getGroups";
import { Group, Groups, GroupSchema, GroupsSchema } from "./types";

import { z} from "zod"
import { pool } from "@/lib/db";
import { toPgArrayLiteral } from "../lib/to-pgarray-array-literal";

const ReturnValSchema = z.object({
    data: z.union([
        z.null(),
        GroupSchema,
        GroupsSchema
    ]),
    error: z.string().nullable()
});


export const addGroup = async (prev: {data: any, error: any}, group: Group) => {
    
    ////console.log("addActivity", prev, activity);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

     const query = `
            with inserted as (
            
            insert into groups (title, join_code, active, created, created_by)
            values ($1, $2, $3, $4, $5)
            returning group_id, title, join_code, active, created_by, created, order_by
            
            )

            SELECT inserted.*
            from inserted;
            `
    try{
        
        const result = await pool.query(query, [group.title, group.join_code, group.active, group.created, group.created_by]);

        if (result.rowCount != 1){
            throw new Error(`Incorrect number of rows updated ${result.rowCount}`);
        }

        // only return courses if there is an issue.
        data = result.rows[0] as Group;

    } catch(err) {
        if (err instanceof Error) {
            console.error(err.message, query);
            error = err.message;

            // get teh current couses so that the UI can refresh
            const {data:prevGroups, error: prevGroupsError} = await getGroups();

            if (prevGroupsError){
                error = error + prevGroupsError
            }

            // assign the current courses to data so that the ui can refresh
            data = prevGroups
        }
    }
    finally {
        ReturnValSchema.parse({data, error});
        
        return {data, error};
    }
};
