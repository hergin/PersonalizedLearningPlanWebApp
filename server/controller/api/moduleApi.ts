import ModuleParser from "../../parser/moduleParser";
import { StatusCode } from "../../types";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { DatabaseError } from "pg";

export default class ModuleAPI {
    parser: ModuleParser;
    errorCodeInterpreter: ErrorCodeInterpreter;

    constructor() {
        this.parser = new ModuleParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async getModules(accountId : number) {
        try {
            const modules = await this.parser.parseModules(accountId);
            console.log(`Parsed modules: \n${JSON.stringify(modules)}`);
            return modules;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async createModule(name: string, description: string, completion_percent: number, accountId: number, coachId?: number) {
        try {
            const result = await this.parser.storeModule(name, description, completion_percent, accountId, coachId);
            return result;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async updateModule(module_id: number, name: string, description: string, completion_percent: number, accountId: number, coachId?: number) {
        try {
            await this.parser.updateModule(name, description, completion_percent, accountId, module_id, coachId);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async deleteModule(moduleID: number) {
        try {
            await this.parser.deleteModule(moduleID);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async getModuleVariable(moduleID: number, variableName: string) {
        try {
            const result = await this.parser.getModuleVariable(moduleID, variableName);
            return result;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }
}