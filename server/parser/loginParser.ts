import DatabaseParser from "./databaseParser";

export default class LoginParser extends DatabaseParser {
    constructor() {
        super();
    }

    async storeLogin(email: string, password: string) {
        const query = {
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [email, password]
        };
        await this.updateDatabase(query);
    }

    async retrieveLogin(email: string) {
        const query = {
            text: "SELECT * FROM ACCOUNT WHERE email = $1",
            values: [email]
        };
        return await this.parseDatabase(query);
    }

    async getEmailById(id: number) {
        const query = {
            text: "SELECT email FROM ACCOUNT WHERE id = $1",
            values: [id]
        }
        return await this.parseDatabase(query);
    }

    async storeToken(accountId: number, refreshToken: string) {
        const query = {
            text: "UPDATE ACCOUNT SET refresh_token = $1 WHERE id = $2",
            values: [refreshToken, accountId]
        };
        await this.updateDatabase(query);
    }

    async parseToken(accountId: number) {
        const query = {
            text: "SELECT refresh_token FROM ACCOUNT WHERE id = $1",
            values: [accountId]
        }
        return await this.parseDatabase(query);
    }

    async deleteToken(accountId: number) {
        const query = {
            text: "UPDATE ACCOUNT SET refresh_token = '' WHERE id = $1",
            values: [accountId]
        };
        await this.updateDatabase(query);
    }

    async deleteAccount(accountId: number) {
        console.log("Deleting account...");
        const query = {
            text: "DELETE FROM ACCOUNT WHERE id = $1",
            values: [accountId]
        };
        await this.updateDatabase(query);
        console.log("Account deleted!");
    }

    async parseUnderstudies(accountId: number) {
        console.log("Parsing Understudies...");
        const query = {
            text: "SELECT * FROM UNDERSTUDY_DATA WHERE coach_id = $1",
            values: [accountId]
        };
        return this.parseDatabase(query);
    }
}
