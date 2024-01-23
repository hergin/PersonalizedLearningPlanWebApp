export {};

const DatabaseParser = require('./dashboardParser');

class ModuleParser extends DatabaseParser {
    constructor() {
        super();
    }

    async storeModule(name : string, description : string, completion_percent : number, email : string) {
        console.log("Storing Module...");
        const storingQuery = {
            text: "INSERT INTO Module(module_name, description, completion_percent, email) VALUES($1, $2, $3, $4)",
            values: [name, description, completion_percent, email]
        };
        await this.updateDatabase(storingQuery);
        console.log("Module Stored!");
        const idQuery = {
            text: "SELECT module_id FROM MODULE WHERE module_name = $1 AND description = $2 AND email = $3",
            values: [name, description, email]
        };
        const result = await this.parseDatabase(idQuery);
        return result[0];
    }

    async parseModules(email : string) {
        console.log("Getting Module...");
        const query = {
            text: "SELECT * FROM Module WHERE email = $1",
            values: [email]
        };
        return this.parseDatabase(query);
    }

    async updateModule(name : string, description : string, completion_percent : number, email : string, module_id : number) {
        console.log("Inserting updated data into Module...");
        const query = {
            text: "UPDATE MODULE SET module_name = $1, description = $2, completion_percent = $3, email = $4 WHERE module_id = $5",
            values: [name, description, completion_percent, email, module_id]
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
}

module.exports = ModuleParser;
