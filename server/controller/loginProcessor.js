const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");

class LoginAPI {
    constructor() {
      this.parser = new DatabaseParser.DatabaseParser();  
    }

    async getAccount(username, password) {
        console.log("Getting account...");
        try {
            const login = await this.parser.retrieveLogin(username, password);
            if(login.length == 0) {
                console.log("Account wasn't found!");
                return STATUS_CODES.UNAUTHORIZED;
            } else {
                console.log("Account found!");
                return login[0].email;
            }
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }
    
    async createAccount(username, password, email) {
        try {
            await this.parser.storeLogin(username, email, password);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }
    
    async createProfile(firstName, lastName, email) {
        try {
            await this.parser.createProfile(firstName, lastName, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async getProfile(email) {
        return await this.parser.getProfile(email);
    }

    #getStatusCode(error) {
        switch(error.code) {
            case '23505':
                console.log("Duplicate data.");
                return STATUS_CODES.CONFLICT;
            case '08000': case '08003': case '08007':
                console.log("Connection error");
                return STATUS_CODES.CONNECTION_ERROR;
            default:
                console.error("Fatal server error.");
                return STATUS_CODES.INTERNAL_SERVER_ERROR;
        }
    }
}

module.exports = LoginAPI;
