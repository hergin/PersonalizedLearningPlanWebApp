const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");

class ModuleAPI {
    constructor() {
        this.parser = new DatabaseParser();
    }

    async getModule(email) {
        try {
            const module = await this.parser.parseModule(email);
            return (module.length === 0) ? STATUS_CODES.UNAUTHORIZED : module[0];
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
