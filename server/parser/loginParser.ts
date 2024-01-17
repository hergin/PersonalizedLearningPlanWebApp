export {};

const DatabaseParser = require("./databaseParser");

class LoginParser extends DatabaseParser {
    async storeLogin(email : string, password : string) {
        console.log("Storing login...");
        const query = {
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [email, password]
        };
        const client = await this.pool.connect();
        await client.query(query);
        client.release();
        console.log("Login Stored!");
    }
    
    async retrieveLogin(email : string) {
        console.log("Retrieving login...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM ACCOUNT WHERE email = $1",
            values: [email]
        };
        const result = await client.query(query);
        client.release();
        console.log("Login found!");
        return result.rows;
    }
    
    async storeToken(email : string, refreshToken : string) {
        console.log("Storing refresh token...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE ACCOUNT SET refresh_token = $1 WHERE email = $2",
            values: [refreshToken, email]
        };
        await client.query(query);
        client.release();
        console.log("Token has been set!");
    }

    async parseToken(email : string) {
        console.log("Retrieving refresh token...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT refresh_token FROM ACCOUNT WHERE email = $1",
            values: [email]
        }
        const result = await client.query(query);
        client.release();
        console.log("Token has been found!");
        return result.rows;
    }

    async deleteToken(email : string) {
        console.log("Deleting token...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE ACCOUNT SET refresh_token = '' WHERE email = $1",
            values: [email]
        };
        await client.query(query);
        client.release();
        console.log("Token deleted!");
    }

    async deleteAccount(email : string) {
        console.log("Deleting account...");
        const client = await this.pool.connect();
        const query = {
            text: "DELETE FROM ACCOUNT WHERE email = $1",
            values: [email]
        };
        await client.query(query);
        client.release();
        console.log("Account deleted!");
    }
}

module.exports = LoginParser;
