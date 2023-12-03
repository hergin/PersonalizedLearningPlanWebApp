const pg = require("pg");
const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, ".env")
});

class DatabaseParser {
    constructor() {
        console.log("Constructing...");
        this.pool = new pg.Pool({
            host: 'localhost',
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            port: process.env.POSTGRES_PORT
        });
        console.log("Constructing complete!");
    }
}

module.exports = DatabaseParser;
