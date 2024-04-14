import bcrypt from "bcryptjs";
import DatabaseParser from "../../parser/databaseParser";
import { User, STATUS_CODE, StatusCode } from "../../types";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { DatabaseError } from "pg";

export default class LoginAPI {
    readonly parser: DatabaseParser;

    constructor() {
        this.parser = new DatabaseParser();
    }

    async verifyLogin(email: string, password: string): Promise<User | StatusCode> {
        try {
            const login = await this.parser.parseDatabase({
                text: "SELECT * FROM ACCOUNT WHERE email = $1",
                values: [email]
            });
            if(login.length === 0) return STATUS_CODE.GONE;
            return await bcrypt.compare(password, login[0].account_password) ?
                {id: login[0].id, role: login[0].site_role} : STATUS_CODE.UNAUTHORIZED;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async createAccount(email: string, password: string) {
        try {
            const hash = await this.hashPassword(password);
            await this.parser.updateDatabase({
                text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
                values: [email, hash]
            });
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async getEmailById(id: number): Promise<any[] | StatusCode> {
        try {
            const email = await this.parser.parseDatabase({
                text: "SELECT email FROM ACCOUNT WHERE id = $1",
                values: [id]
            });
            console.log(`Parsed account: \n${JSON.stringify(email)}`);
            return email;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    private async hashPassword(password : string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async setToken(accountId: number, refreshToken : string) {
        try {
            await this.parser.updateDatabase({
                text: "UPDATE ACCOUNT SET refresh_token = $1 WHERE id = $2",
                values: [refreshToken, accountId]
            });
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async verifyToken(accountId: number, refreshToken: string): Promise<StatusCode> {
        try {
            const result = await this.parser.parseDatabase({
                text: "SELECT refresh_token FROM ACCOUNT WHERE id = $1",
                values: [accountId]
            });
            if (result.length === 0) return STATUS_CODE.GONE;
            return (result[0].refresh_token === refreshToken) ? STATUS_CODE.OK : STATUS_CODE.UNAUTHORIZED;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async logout(accountId: number): Promise<StatusCode> {
        try {
            await this.parser.updateDatabase({
                text: "UPDATE ACCOUNT SET refresh_token = '' WHERE id = $1",
                values: [accountId]
            });
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async delete(accountId: number) {
        try {
            await this.parser.updateDatabase({
                text: "DELETE FROM ACCOUNT WHERE id = $1",
                values: [accountId]
            });
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async getUnderstudies(accountId: number) {
        try {
            return await this.parser.parseDatabase({
                text: "SELECT * FROM UNDERSTUDY_DATA WHERE coach_id = $1",
                values: [accountId]
            });
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}
