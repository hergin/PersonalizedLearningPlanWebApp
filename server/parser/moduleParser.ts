import { Module } from '../types';
import DatabaseParser from './databaseParser';

export default class ModuleParser extends DatabaseParser {
    constructor() {
        super();
    }

    async storeModule(module: Module) {
        console.log("Storing Module...");
        const query = {
            text: 'INSERT INTO Module(module_name, description, completion_percent, account_id) VALUES($1, $2, $3, $4)',
            values: [module.name, module.description, module.completion, module.accountId]
        };
        await this.updateDatabase(query);
        console.log("Module Stored!");
    }

    async parseModules(account_id: number) {
        console.log("Getting Module...");
        const query = {
            text: "SELECT * FROM Module WHERE account_id = $1",
            values: [account_id]
        };
        return this.parseDatabase(query);
    }

    async updateModule(module: Module) {
        console.log("Inserting updated data into Module...");
        const query = {
            text: "UPDATE MODULE SET module_name = $1, description = $2, completion_percent = $3 WHERE module_id = $4",
            values: [module.name, module.description, module.completion, module.id]
        };
        await this.updateDatabase(query);
        console.log("Module data updated!");
    }

    async deleteModule(module_id: number) {
        console.log("Deleting Module...");
        const query = {
            text: "DELETE FROM Module WHERE module_id = $1",
            values: [module_id]
        };
        await this.updateDatabase(query);
        console.log("Deleted Module!");
    }

    async getModuleVariable(module_id: number, variable: string) {
        console.log("Getting module completion...");
        const query = {
            text: `SELECT ${variable} FROM MODULE WHERE module_id = $1`,
            values: [module_id]
        };
        return this.parseDatabase(query);
    }

    async runMaintenanceProcedures() {
        console.log("Executing module's maintenance procedures...");
        await this.updateDatabase("CALL update_module_completion()");
        console.log("Maintenance Procedures are complete!");
    }
}
