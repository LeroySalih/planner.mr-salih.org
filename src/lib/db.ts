import pg from "pg";

export const dbConnection = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST
};



const { Pool } = pg
export const pool = new Pool(dbConnection);

try{

//console.log("Database connection established", dbConnection);

const result = await pool.query("SELECT current_database(), current_schema();");
//console.log("Database connection result", result.rows);

const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';");
//console.log("Database tables", tables.rows);

} catch (error) {
    console.error("Error connecting to the database", error);
}
