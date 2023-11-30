const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../utils/statusCodes");
const StatusCodes = require("./StatusCodes");

class ModuleAPI {
    constructor() {
        this.parser = new DatabaseParser();
        this.statusCode = new StatusCodes();
    }

    async getModules(email) {
        try {
            const modules = await this.parser.parseModules(email);
            console.log(`Parsed modules: \n${modules}`);
            return modules;
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

    async deleteModule(moduleID) {
        try {
            await this.parser.deleteModule(moduleID);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }
}

module.exports = ModuleAPI;
