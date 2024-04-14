import bcrypt from "bcryptjs";
import LoginParser from "../../parser/loginParser";
import { User, STATUS_CODE, StatusCode } from "../../types";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { DatabaseError } from "pg";

export default class LoginAPI {
    readonly parser: LoginParser;

    constructor() {
        this.parser = new LoginParser();
    }
    
    async verifyLogin(email: string, password: string): Promise<User | StatusCode> {
        try {
            const login = await this.parser.retrieveLogin(email);
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
            await this.parser.storeLogin(email, hash);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async getAccountById(accountId: number): Promise<any[] | StatusCode> {
        try {
            const email = await this.parser.getEmailById(accountId);
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
            await this.parser.storeToken(accountId, refreshToken);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async verifyToken(accountId: number, refreshToken: string): Promise<StatusCode> {
        try {
            const result = await this.parser.parseToken(accountId);
            if (result.length === 0) return STATUS_CODE.GONE;
            return (result[0].refresh_token === refreshToken) ? STATUS_CODE.OK : STATUS_CODE.UNAUTHORIZED;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async logout(accountId: number): Promise<StatusCode> {
        try {
            await this.parser.deleteToken(accountId);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async delete(accountId: number) {
        try {
            await this.parser.deleteAccount(accountId);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async getUnderstudies(accountId: number) {
        try {
            return await this.parser.parseUnderstudies(accountId);
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}
