const DatabaseParser = require('./databaseParser');

class GoalParser extends DatabaseParser {
    async parseGoals(module_id) {
        console.log("Getting Goals...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM Goal WHERE module_id = $1",
            values: [module_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Found Goals!");
        return result.rows;
    }

    async storeGoal(name, description, completion_perc, module_id) {
        console.log("Storing Goal...");
        const query = {
            text: "INSERT INTO GOAL(name, description, completion_perc, module_id) VALUES($1, $2, $3, $4)",
            values: [name, description, completion_perc, module_id]
        };
        const client = await this.pool.connect();
        await client.query(query);
        client.release();
        console.log("Goal Stored!");
    }

    async updateGoal(name, description, completion, module_id, goal_id) {
        console.log("Inserting updated data into Goal...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE GOAL SET name = $1, description = $2, completion_perc = $3, module_id = $4, goal_id = $5 WHERE goal_id = $5",
            values: [name, description, completion, module_id, goal_id]
        };
        await client.query(query);
        client.release();
        console.log("Goal data updated!");
    }

    async deleteGoal(goal_id) {
        console.log("Deleting Goal...");
        const client = await this.pool.connect();
        const query = {
            text: "DELETE FROM Goal WHERE goal_id = $1",
            values: [goal_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Deleted Goal!");
        return result.rows;
    }
}

module.exports = GoalParser;
