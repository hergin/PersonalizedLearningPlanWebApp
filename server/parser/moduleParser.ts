import DatabaseParser from './databaseParser';

export default class ModuleParser extends DatabaseParser {
    constructor() {
        super();
    }

    async storeModule(name : string, description : string, completion_percent : number, account_id : number) {
        console.log("Storing Module...");
        const storingQuery = {
            text: "INSERT INTO Module(module_name, description, completion_percent, account_id) VALUES($1, $2, $3, $4)",
            values: [name, description, completion_percent, account_id]
        };
        await this.updateDatabase(storingQuery);
        console.log("Module Stored!");
        const idQuery = {
            text: "SELECT module_id FROM MODULE WHERE module_name = $1 AND description = $2 AND account_id = $3",
            values: [name, description, account_id]
        };
        const result = await this.parseDatabase(idQuery);
        return result[0];
    }

    async parseModules(account_id : number) {
        console.log("Getting Module...");
        const query = {
            text: "SELECT * FROM Module WHERE account_id = $1",
            values: [account_id]
        };
        return this.parseDatabase(query);
    }

    async updateModule(name : string, description : string, completion_percent : number, account_id : number, module_id : number) {
        console.log("Inserting updated data into Module...");
        const query = {
            text: "UPDATE MODULE SET module_name = $1, description = $2, completion_percent = $3, account_id = $4 WHERE module_id = $5",
            values: [name, description, completion_percent, account_id, module_id]
        };
        await this.updateDatabase(query);
        console.log("Module data updated!");
    }

    async deleteModule(module_id : number) {
        console.log("Deleting Module...");
        const query = {
            text: "DELETE FROM Module WHERE module_id = $1",
            values: [module_id]
        };
        await this.updateDatabase(query);
        console.log("Deleted Module!");
    }

    async getModuleVariable(module_id : number, variable : string) {
        console.log("Getting module completion...");
        const query = {
            text: `SELECT ${variable} FROM MODULE WHERE module_id = $1`,
            values: [module_id]
        };
        return this.parseDatabase(query);
    }

    async runMaintenanceProcedures() {
        console.log("Executing module's maintenance procedures...");
        return this.parseDatabase("CALL update_module_completion()");
    }
}
