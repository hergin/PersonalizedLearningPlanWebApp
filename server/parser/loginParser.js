const DatabaseParser = require('./databaseParser');

class LoginParser extends DatabaseParser {
    async storeLogin(email, password) {
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
    
    async retrieveLogin(email) {
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
    
    async storeToken(email, refreshToken) {
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

    async parseToken(email) {
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

    async deleteToken(email) {
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

    async deleteAccount(email) {
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
