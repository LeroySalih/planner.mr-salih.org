import { pool } from "@/lib/db";
import { ProfileSchema } from "./types";
import { z } from "zod";


export const ReturnValSchema = z.object({
    data: ProfileSchema.nullable(),
    error: z.string().nullable()
});

export type ReturnVal = z.infer<typeof ReturnValSchema>;

export const createNewProfile = async (user_id: string, first_name: string, last_name: string): Promise<ReturnVal> => {
    let data = null, error = null;

    console.log("createNewProfile: user_id", user_id);

    try {
        const query = `
            INSERT INTO profiles (user_id, first_name, last_name, is_teacher, created_by)
            VALUES ($1, $2, $3, $4, $1)
            RETURNING *;
        `;

        const result = await pool.query(query, [user_id, first_name, last_name, false]);

        data = result.rows[0];
        data.created = data.created.toISOString(); // Convert to ISO string if needed

    } catch (err) {
        if (err instanceof Error) {
            console.error("createNewProfile: returns", data, error);
            error = err.message;
        }
    } finally {
        console.log("createNewProfile: returns", data, error);
        
        const result = ReturnValSchema.parse({data, error});
        console.log("Result", result);
        return result;
    }
};

// Types