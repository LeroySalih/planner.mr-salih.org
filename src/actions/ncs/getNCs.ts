"use server"
import {z} from "zod";
import {pool} from "@/lib/db";
import {NC, type NCs, NCsSchema} from "./types";

const ReturnValSchema = z.object({
    data: NCsSchema.nullable(),
    error: z.string().nullable()
});



export type ReturnVal = z.infer<typeof ReturnValSchema>;


export const getNCs = async (): Promise<ReturnVal> => {

    let data = null, error = null;
    
    try{
        const query = `
            select ncs.nc_id, ncs.title, ncs.active, ncs.created, ncs.created_by, ncs.order_by,  
            COALESCE(
                json_agg(
                    json_build_object('nc_item_id', ni.nc_item_id,'category', ni.category, 'item_text', ni.item_text )) filter (where ni.nc_item_id is not NULL),
                    '[]'::json
                ) as nc_items
            from ncs
            left join nc_items ni on ncs.nc_id = ni.nc_id
            where ncs.active = true
            group by ncs.nc_id
            order by ncs.order_by;
            `
        const result = await pool.query(query);

        data =  (result.rows.map((row:any) => ({
            ...row,
            // if `row.created` is already a Date
            created: row.created.toISOString()
          })) || [] ) as NCs;
    
    } catch(err) {
        
        if (err instanceof Error){
            console.error("getNCs: returns", data, err)
            error = err.message;
        }

    } finally {
        ////console.log("getNCsByID: returns", data, error)
        ReturnValSchema.parse({data, error});
        return {data, error}
    }
}