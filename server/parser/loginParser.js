const DatabaseParser = require('./databaseParser');

class LoginParser extends DatabaseParser {
    async storeLogin(username, email, password) {
        console.log("Storing login...");
        const query = {
            text: "INSERT INTO ACCOUNT(username, account_password, email) VALUES($1, $2, $3)",
            values: [username, password, email]
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
            text: "UPDATE ACCOUNT SET refreshToken = $1 WHERE email = $2",
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
            text: "SELECT refreshToken FROM ACCOUNT WHERE email = $1",
            values: [email]
        }
        const result = await client.query(query);
        client.release();
        console.log("Token has been found!");
        return result.rows;
    }
}

module.exports = LoginParser;
