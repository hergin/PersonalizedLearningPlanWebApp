const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, ".env")
});
const bcrypt = require("bcryptjs");
const LoginParser = require("../parser/loginParser");
const STATUS_CODES = require("../utils/statusCodes");
const StatusCodes = require("./StatusCodes");

class LoginAPI {
    constructor() {
      this.parser = new LoginParser();
      this.statusCode = new StatusCodes();
    }

    async verifyLogin(email, password) {
        try {
            const login = await this.parser.retrieveLogin(email);
            if(login.length === 0) return STATUS_CODES.GONE;
            return await bcrypt.compare(password, login[0].account_password) ? STATUS_CODES.OK : STATUS_CODES.UNAUTHORIZED;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }
    
    async createAccount(email, password) {
        try {
            console.log(password);
            const hash = await this.#hashPassword(password);
            console.log(hash);
            await this.parser.storeLogin(email, hash);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async setToken(email, refreshToken) {
        try {
            await this.parser.storeToken(email, refreshToken);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async verifyToken(email, refreshToken) {
        try {
            const result = await this.parser.parseToken(email);
            if(result.length === 0) return STATUS_CODES.GONE;
            return (result[0].refresh_token === refreshToken) ? STATUS_CODES.OK : STATUS_CODES.UNAUTHORIZED;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async logout(email) {
        try {
            await this.parser.deleteToken(email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async delete(email) {
        try {
            await this.parser.deleteAccount(email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async #hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

module.exports = LoginAPI;
