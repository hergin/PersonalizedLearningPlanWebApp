import ModuleParser from "../../parser/moduleParser";
import { Module, StatusCode } from "../../types";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { DatabaseError } from "pg";

export default class ModuleAPI {
    parser: ModuleParser;
    errorCodeInterpreter: ErrorCodeInterpreter;

    constructor() {
        this.parser = new ModuleParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async getModules(accountId : number): Promise<Module[] | StatusCode> {
        try {
            const modules = await this.parser.parseModules(accountId);
            console.log(`Parsed modules: \n${JSON.stringify(modules)}`);
            return modules;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async createModule(module: Module): Promise<StatusCode> {
        try {
            await this.parser.storeModule(module);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async updateModule(module: Module): Promise<StatusCode> {
        if(!module.id) {
            return StatusCode.BAD_REQUEST;
        }

        try {
            await this.parser.updateModule(module);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async deleteModule(moduleID: number): Promise<StatusCode> {
        try {
            await this.parser.deleteModule(moduleID);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async getModuleVariable(moduleID: number, variableName: string) {
        try {
            return await this.parser.getModuleVariable(moduleID, variableName);
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }
}