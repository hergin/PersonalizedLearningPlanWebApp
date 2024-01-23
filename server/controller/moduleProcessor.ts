export {};

const ModuleParser = require("../parser/moduleParser");
const STATUS_CODES = require("../utils/statusCodes");
const ErrorCodeInterpreter = require("./errorCodeInterpreter");

class ModuleAPI {
    parser : typeof ModuleParser;
    errorCodeInterpreter : typeof ErrorCodeInterpreter;

    constructor() {
        this.parser = new ModuleParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async getModules(email : string) {
        try {
            const modules = await this.parser.parseModules(email);
            console.log(`Parsed modules: \n${modules}`);
            return modules;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async createModule(name : string, description : string, completion_percent : number, email : string) {
        try {
            const result = await this.parser.storeModule(name, description, completion_percent, email);
            return result;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async updateModule(module_id : number, name : string, description : string, completion_percent : number, email : string) {
        try {
            await this.parser.updateModule(name, description, completion_percent, email, module_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async deleteModule(moduleID : number) {
        try {
            await this.parser.deleteModule(moduleID);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }
}

module.exports = ModuleAPI;