import path from "path";
require('dotenv').config({
    path: path.join(__dirname, ".env")
});
import bcrypt from "bcryptjs";
import LoginParser from "../parser/loginParser";
import { STATUS_CODES } from "../utils/statusCodes";
import ErrorCodeInterpreter from "./errorCodeInterpreter";

export default class LoginAPI {
    parser : LoginParser;
    errorCodeInterpreter : ErrorCodeInterpreter;

    constructor() {
      this.parser = new LoginParser();
      this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async verifyLogin(email : string, password : string) {
        try {
            const login = await this.parser.retrieveLogin(email);
            if(login.length === 0) return STATUS_CODES.GONE;
            return await bcrypt.compare(password, login[0].account_password) ? STATUS_CODES.OK : STATUS_CODES.UNAUTHORIZED;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }
    
    async createAccount(email : string, password : string) {
        try {
            console.log(password);
            const hash = await this.hashPassword(password);
            console.log(hash);
            await this.parser.storeLogin(email, hash);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async setToken(email : string, refreshToken : string) {
        try {
            await this.parser.storeToken(email, refreshToken);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async verifyToken(email : string, refreshToken : string) {
        try {
            const result = await this.parser.parseToken(email);
            if(result.length === 0) return STATUS_CODES.GONE;
            return (result[0].refresh_token === refreshToken) ? STATUS_CODES.OK : STATUS_CODES.UNAUTHORIZED;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async logout(email : string) {
        try {
            await this.parser.deleteToken(email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async delete(email : string) {
        try {
            await this.parser.deleteAccount(email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async hashPassword(password : string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}
