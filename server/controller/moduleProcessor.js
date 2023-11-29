const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");

class ModuleAPI {
    constructor() {
        this.parser = new DatabaseParser();
    }

    async getModules(email) {
        try {
            const modules = await this.parser.parseModules(email);
            console.log(`Parsed modules: \n${modules}`);
            return modules;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async createModule(name, description, completion_percent, email) {
        try {
            await this.parser.storeModule(name, description, completion_percent, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async updateModule(name, description, completion_percent, email) {
        try {
            await this.parser.updateModule(name, description, completion_percent, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async deleteModule(email) {
        try {
            await this.parser.deleteModule(email);
            return STATUS_CODES.OK;
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
            default:
                console.error("Fatal server error.", error);
                return STATUS_CODES.INTERNAL_SERVER_ERROR;
        }
    }
}

module.exports = ModuleAPI;
