const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");
const StatusCodes = require("./StatusCodes");

class ModuleAPI {
    constructor() {
        this.parser = new DatabaseParser();
        this.statusCode = new StatusCodes();
    }

    async getModule(email) {
        try {
            const module = await this.parser.parseModule(email);
            return (module.length === 0) ? STATUS_CODES.UNAUTHORIZED : module[0];
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async createModule(name, description, completion_percent, email) {
        try {
            await this.parser.storeModule(name, description, completion_percent, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async updateModule(name, description, completion_percent, email) {
        try {
            await this.parser.updateModule(name, description, completion_percent, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async deleteModule(email) {
        try {
            await this.parser.deleteModule(email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }
}

module.exports = ModuleAPI;
