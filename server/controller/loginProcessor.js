const path = require("path");
require('dotenv').config({
    path: path.join(__dirname, ".env")
});
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");

class LoginAPI {
    constructor() {
      this.parser = new DatabaseParser();
    }

    async verifyLogin(email, password) {
        try {
            const login = await this.parser.retrieveLogin(email);
            if(login.length === 0) {
                return STATUS_CODES.GONE;
            }
            return await bcrypt.compare(password, login[0].account_password) ? STATUS_CODES.OK : STATUS_CODES.UNAUTHORIZED;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }
    
    async createAccount(username, password, email) {
        try {
            console.log(password);
            const hash = await this.#hashPassword(password);
            console.log(hash);
            await this.parser.storeLogin(username, email, hash);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }
    
    async createProfile(firstName, lastName, email) {
        try {
            await this.parser.storeProfile(firstName, lastName, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async getProfile(email) {
        try {
            const profile = await this.parser.parseProfile(email);
            return (profile.length === 0) ? STATUS_CODES.UNAUTHORIZED : profile;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    #getStatusCode(error) {
        switch(error.code) {
            case '23505':
                console.log("Duplicate data.");
                return STATUS_CODES.CONFLICT;
            case '08000': case '08003': case '08007':
                console.log("Connection error");
                return STATUS_CODES.CONNECTION_ERROR;
            case '23514':
                console.log("Bad data.");
                return STATUS_CODES.BAD_REQUEST;    
            default:
                console.error("Fatal server error.", error);
                return STATUS_CODES.INTERNAL_SERVER_ERROR;
        }
    }

    async #hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

module.exports = LoginAPI;
