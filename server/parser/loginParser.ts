import DatabaseParser from "./databaseParser";

export default class LoginParser extends DatabaseParser {
    constructor() {
        super();
    }
    
    async storeLogin(email : string, password : string) {
        const query = {
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [email, password]
        };
        await this.updateDatabase(query);
    }
    
    async retrieveLogin(email : string) {
        const query = {
            text: "SELECT * FROM ACCOUNT WHERE email = $1",
            values: [email]
        };
        return await this.parseDatabase(query);
    }
    
    async storeToken(email : string, refreshToken : string) {
        const query = {
            text: "UPDATE ACCOUNT SET refresh_token = $1 WHERE email = $2",
            values: [refreshToken, email]
        };
        await this.updateDatabase(query);
    }

    async parseToken(email : string) {
        const query = {
            text: "SELECT refresh_token FROM ACCOUNT WHERE email = $1",
            values: [email]
        }
        return await this.parseDatabase(query);
    }

    async deleteToken(email : string) {
        const query = {
            text: "UPDATE ACCOUNT SET refresh_token = '' WHERE email = $1",
            values: [email]
        };
        await this.updateDatabase(query);
    }

    async deleteAccount(email : string) {
        console.log("Deleting account...");
        const query = {
            text: "DELETE FROM ACCOUNT WHERE email = $1",
            values: [email]
        };
        await this.updateDatabase(query);
        console.log("Account deleted!");
    }
}
