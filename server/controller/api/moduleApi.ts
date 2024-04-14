import DatabaseParser from "../../parser/databaseParser";
import { Module, STATUS_CODE, StatusCode } from "../../types";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { DatabaseError } from "pg";

export default class ModuleAPI {
    readonly parser: DatabaseParser;

    constructor() {
        this.parser = new DatabaseParser();
    }

    async getModules(accountId: number): Promise<Module[] | StatusCode> {
        try {
            const modules = await this.parser.parseDatabase({
                text: "SELECT * FROM Module WHERE account_id = $1",
                values: [accountId]
            });
            return modules;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async createModule(module: Module): Promise<StatusCode> {
        try {
            await this.parser.updateDatabase({
                text: 'INSERT INTO Module(module_name, description, completion_percent, account_id) VALUES($1, $2, $3, $4)',
                values: [module.name, module.description, module.completion, module.accountId]
            });
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
            await this.parser.updateDatabase({
                text: "UPDATE MODULE SET module_name = $1, description = $2, completion_percent = $3 WHERE module_id = $4",
                values: [module.name, module.description, module.completion, module.id]
            });
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async deleteModule(moduleId: number): Promise<StatusCode> {
        try {
            await this.parser.updateDatabase({
                text: "DELETE FROM Module WHERE module_id = $1",
                values: [moduleId]
            });
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async getModuleVariable(moduleId: number, variableName: string) {
        try {
            return await this.parser.parseDatabase({
                text: `SELECT ${variableName} FROM MODULE WHERE module_id = $1`,
                values: [moduleId]
            });
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}