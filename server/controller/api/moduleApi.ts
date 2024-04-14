import ModuleParser from "../../parser/moduleParser";
import { Module, STATUS_CODE, StatusCode } from "../../types";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { DatabaseError } from "pg";

export default class ModuleAPI {
    readonly parser: ModuleParser;

    constructor() {
        this.parser = new ModuleParser();
    }

    async getModules(accountId: number): Promise<Module[] | StatusCode> {
        try {
            const modules = await this.parser.parseModules(accountId);
            return modules;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
    async getModuleById(moduleId: number): Promise<Module[] | StatusCode> {
        try {
            const module = await this.parser.parseModuleById(moduleId);
            return module;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async createModule(module: Module): Promise<StatusCode> {
        try {
            await this.parser.storeModule(module);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async updateModule(module: Module): Promise<StatusCode> {
        if (!module.id) {
            return STATUS_CODE.BAD_REQUEST;
        }

        try {
            await this.parser.updateModule(module);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async deleteModule(moduleID: number): Promise<StatusCode> {
        try {
            await this.parser.deleteModule(moduleID);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async getModuleVariable(moduleID: number, variableName: string) {
        try {
            return await this.parser.getModuleVariable(moduleID, variableName);
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}