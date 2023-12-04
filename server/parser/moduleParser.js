const DatabaseParser = require('./dashboardParser');

class ModuleParser extends DatabaseParser {
    async storeModule(name, description, completion_percent, email) {
        console.log("Storing Module...");
        const storingQuery = {
            text: "INSERT INTO Module(module_name, description, completion_percent, email) VALUES($1, $2, $3, $4)",
            values: [name, description, completion_percent, email]
        };
        const client = await this.pool.connect();
        await client.query(storingQuery);
        console.log("Module Stored!");
        const idQuery = {
            text: "SELECT module_id FROM MODULE WHERE module_name = $1 AND description = $2 AND email = $3",
            values: [name, description, email]
        };
        const result = await client.query(idQuery);
        client.release();
        return result.rows[0];
    }

    async parseModules(email) {
        console.log("Getting Module...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM Module WHERE email = $1",
            values: [email]
        };
        const result = await client.query(query);
        client.release();
        console.log("Found Module!");
        return result.rows;
    }

    async updateModule(name, description, completion_percent, email, module_id) {
        console.log("Inserting updated data into Module...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE MODULE SET module_name = $1, description = $2, completion_percent = $3, email = $4 WHERE module_id = $5",
            values: [name, description, completion_percent, email, module_id]
        };
        await client.query(query);
        client.release();
        console.log("Module data updated!");
    }

    async deleteModule(module_id) {
        console.log("Deleting Module...");
        const client = await this.pool.connect();
        const query = {
            text: "DELETE FROM Module WHERE module_id = $1",
            values: [module_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Deleted Module!");
        return result.rows;
    }
}

module.exports = ModuleParser;
