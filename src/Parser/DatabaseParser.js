import { Pool } from 'pg';
const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, ".env")
});

export class DatabaseParser {
    constructor() {
        console.log("Constructing...");
        this.pool = new Pool({
            host: 'localhost',
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            port: process.env.POSTGRES_PORT
        });
        this.pool.on("error", (error) => {
            console.error("An error has occurred while parsing data.", error);
        });
        console.log("Constructing complete!");
    }

    async storeLogin(username, email, password) {
        console.log("Storing login...");
        const query = {
            text: "INSERT INTO ACCOUNT(username, account_password, email) VALUES($1, $2, $3)",
            values: [username, password, email]
        }
        const client = await this.pool.connect();
        await client.query(query);
        client.release();
        console.log("Login stored!");
    }
    
    async retrieveLogin(username, password) {
        console.log("Retrieving login...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM ACCOUNT WHERE username = $1 AND account_password = $2",
            values: [username, password]
        }
        const result = await client.query(query);
        client.release();
        console.log("Login found!");
        return result;
    }
}
