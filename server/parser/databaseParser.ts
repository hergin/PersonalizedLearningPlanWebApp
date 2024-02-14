import pg from "pg";
import path from "path";
require('dotenv').config({
    path: path.join(__dirname, ".env")
});

interface Query {
    text: string,
    values: (string | number | boolean | Date | undefined)[]
}

export default class DatabaseParser {
    pool : any;

    constructor() {
        this.pool = new pg.Pool({
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
