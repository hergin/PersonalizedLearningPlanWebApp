const bcrypt = require("bcrypt");
const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");
const StatusCodes = require("./StatusCodes");

class LoginAPI {
    constructor() {
      this.parser = new DatabaseParser();
      this.statusCode = new StatusCodes();
    }

    async verifyLogin(email, password) {
        try {
            const login = await this.parser.retrieveLogin(email);
            if(login.length === 0) {
                return STATUS_CODES.GONE;
            }
            return await bcrypt.compare(password, login[0].account_password) ? STATUS_CODES.OK : STATUS_CODES.UNAUTHORIZED;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
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
            return this.statusCode.getStatusCode(error);
        }
    }

    async #hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

module.exports = LoginAPI;
