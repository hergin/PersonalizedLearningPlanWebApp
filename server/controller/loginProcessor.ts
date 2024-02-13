import path from "path";
require('dotenv').config({
    path: path.join(__dirname, ".env")
});
import bcrypt from "bcryptjs";
import LoginParser from "../parser/loginParser";
import { StatusCode } from "../types";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";

export class LoginAPI {
    parser : LoginParser;
    errorCodeInterpreter : ErrorCodeInterpreter;

    constructor() {
      this.parser = new LoginParser();
      this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async verifyLogin(email : string, password : string) {
        try {
            const login = await this.parser.retrieveLogin(email);
            if(login.length === 0) return StatusCode.GONE;
            return await bcrypt.compare(password, login[0].account_password) ? login[0].id : StatusCode.UNAUTHORIZED;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }
    
    async createAccount(email : string, password : string) {
        try {
            console.log(password);
            const hash = await this.#hashPassword(password);
            console.log(hash);
            await this.parser.storeLogin(email, hash);
            return StatusCode.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async setToken(accountId: number, refreshToken : string) {
        try {
            await this.parser.storeToken(accountId, refreshToken);
            return StatusCode.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async verifyToken(accountId: number, refreshToken : string) {
        try {
            const result = await this.parser.parseToken(accountId);
            if(result.length === 0) return StatusCode.GONE;
            return (result[0].refresh_token === refreshToken) ? StatusCode.OK : StatusCode.UNAUTHORIZED;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async logout(accountId : number) {
        try {
            await this.parser.deleteToken(accountId);
            return StatusCode.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async delete(accountId : number) {
        try {
            await this.parser.deleteAccount(accountId);
            return StatusCode.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async #hashPassword(password : string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}
