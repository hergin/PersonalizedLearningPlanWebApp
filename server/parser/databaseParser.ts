import { Pool } from "pg";
import { join } from "path";
import dotenv from "dotenv";
import { Query } from "../types";

dotenv.config({
    path: join(__dirname, ".env")
});

export default class DatabaseParser {
    pool : Pool;

    constructor() {
        this.pool = new Pool({
            host: process.env.POSTGRES_HOST || 'db',
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 0
        });
    }

    async updateDatabase(query : Query | string) {
       await this.pool.query(query);
    }

    async parseDatabase(query : Query | string) {
        const result = await this.pool.query(query);
        return result.rows;
    }
}
