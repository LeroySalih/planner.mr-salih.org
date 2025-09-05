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


export const updateGroup = async (prev: {data: any, error: any}, group: Group) => {
    
    ////console.log("addActivity", prev, activity);

    //const {data, error} = await getCourses();
    let data = null;
    let error = null;

     const query = `
            with updated as (
            
            update groups 
                set title = $2,
                    join_code = $3,
                    active = $4
                
            where group_id = $1
                    

            returning group_id, title, join_code, active, created_by, created, order_by
            
            )

            SELECT updated.*
            from updated;
            `
    try{
        
        const result = await pool.query(query, [group.group_id, group.title, group.join_code, group.active]);

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
