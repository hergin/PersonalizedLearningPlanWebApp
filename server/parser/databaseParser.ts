export {};

const pg = require("pg");
const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, ".env")
});

interface Query {
    text: string,
    values: (string | number | boolean)[]
}

class DatabaseParser {
    pool : any;

    constructor() {
        console.log("Constructing...");
        this.pool = new pg.Pool({
            host: process.env.POSTGRES_HOST || 'db',
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 0
        });
        console.log("Constructing complete!");
    }

    async updateDatabase(query : Query) {
        await this.pool.query(query);
    }

    async parseDatabase(query : Query) {
        const result = await this.pool.query(query);
        return result.rows;
    }
}

module.exports = DatabaseParser;
