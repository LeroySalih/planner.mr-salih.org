import {z} from "zod";



const NCItemSchema = z.object({
    nc_item_id: z.string(),
    item_text: z.string(),
    category: z.string(),
});

const NCItemsSchema = z.array(NCItemSchema);

const NCSchema = z.object({
    nc_id : z.string(),
    title : z.string(),
    nc_items: NCItemsSchema,
    active : z.boolean(),
    created: z.string().refine(s => !isNaN(Date.parse(s)), {
        message: "Invalid ISO date string"
      }),
    created_by: z.string(),
    order_by: z.number()
});


export type NC = z.infer<typeof NCSchema>;
export const NCsSchema = z.array(NCSchema);
export type NCs = z.infer<typeof NCsSchema>;