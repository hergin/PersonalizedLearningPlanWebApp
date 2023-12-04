const ModuleParser = require("../parser/moduleParser");
const STATUS_CODES = require("../utils/statusCodes");
const StatusCodes = require("./StatusCodes");

class ModuleAPI {
    constructor() {
        this.parser = new ModuleParser();
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
            const result = await this.parser.storeModule(name, description, completion_percent, email);
            return result;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async updateModule(module_id, name, description, completion_percent, email) {
        try {
            await this.parser.updateModule(name, description, completion_percent, email, module_id);
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
