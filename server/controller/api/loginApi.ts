import bcrypt from "bcryptjs";
import LoginParser from "../../parser/loginParser";
import { Role, AuthProps, StatusCode } from "../../types";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { DatabaseError } from "pg";

export default class LoginAPI {
    parser : LoginParser;
    errorCodeInterpreter : ErrorCodeInterpreter;

    constructor() {
      this.parser = new LoginParser();
      this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async verifyLogin(email : string, password : string): Promise<AuthProps | StatusCode> {
        try {
            const login = await this.parser.retrieveLogin(email);
            if(login.length === 0) return StatusCode.GONE;
            return await bcrypt.compare(password, login[0].account_password) ? 
                {id: login[0].id, role: login[0].site_role} : StatusCode.UNAUTHORIZED;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }
    
    async createAccount(email : string, password : string) {
        try {
            const hash = await this.hashPassword(password);
            await this.parser.storeLogin(email, hash);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    private async hashPassword(password : string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async setToken(accountId: number, refreshToken : string): Promise<StatusCode> {
        try {
            await this.parser.storeToken(accountId, refreshToken);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async verifyToken(accountId: number, refreshToken : string): Promise<StatusCode> {
        try {
            const result = await this.parser.parseToken(accountId);
            if(result.length === 0) return StatusCode.GONE;
            return (result[0].refresh_token === refreshToken) ? StatusCode.OK : StatusCode.UNAUTHORIZED;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async logout(accountId : number): Promise<StatusCode> {
        try {
            await this.parser.deleteToken(accountId);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async delete(accountId : number) {
        try {
            await this.parser.deleteAccount(accountId);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async getUnderstudies(accountId: number) {
        try {
            return await this.parser.parseUnderstudies(accountId);
        } catch (error : unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }
}
