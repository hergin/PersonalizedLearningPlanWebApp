export {};

const DatabaseParser = require("./databaseParser");

class GoalParser extends DatabaseParser {
    constructor() {
        super();
    }

    async parseGoals(module_id : number) {
        console.log("Getting Goals...");
        const query = {
            text: "SELECT * FROM Goal WHERE module_id = $1",
            values: [module_id]
        };
        return this.parseDatabase(query);
    }

    async storeGoal(name : string, description : string, is_complete : boolean, module_id : number) {
        console.log("Storing Goal...");
        const query = {
            text: "INSERT INTO GOAL(name, description, is_complete, module_id) VALUES($1, $2, $3, $4)",
            values: [name, description, is_complete, module_id]
        };
        await this.updateDatabase(query);
        console.log("Goal Stored!");
        const idQuery = {
            text: "SELECT goal_id FROM GOAL WHERE name = $1 AND description = $2 AND module_id = $3",
            values: [name, description, module_id]
        }
        return this.parseDatabase(idQuery);
    }

    async updateGoal(goal_id : number, name : string, description : string, completion : boolean) {
        console.log("Inserting updated data into Goal...");
        const query = {
            text: "UPDATE GOAL SET name = $1, description = $2, is_complete = $3 WHERE goal_id = $4",
            values: [name, description, completion, goal_id]
        };
        await this.updateDatabase(query);
        console.log("Goal data updated!");
    }

    async updateGoalTimestamps(goal_id : number, completion_time : string, expiration? : string) {
        console.log("Inserting timestamp values into Goal...");
        const queryString = `UPDATE GOAL SET completion_time = $1${expiration ? ", expiration = $2" : ""} WHERE goal_id = ${expiration ? "$3" : "$2"}`;
        const query = {
            text: queryString,
            values: expiration ? [completion_time, expiration, goal_id] : [completion_time, goal_id]
        };
        await this.updateDatabase(query);
        console.log("Timestamps updated!");
    }

    async deleteGoal(goal_id : number) {
        console.log("Deleting Goal...");
        const query = {
            text: "DELETE FROM Goal WHERE goal_id = $1",
            values: [goal_id]
        };
        await this.updateDatabase(query);
        console.log("Goal successfully deleted!");
    }

    async getGoal(goal_id : number) {
        console.log("Getting goal...");
        const query = {
            text: "SELECT * FROM GOAL WHERE goal_id = $1",
            values: [goal_id]
        };
        return this.parseDatabase(query);
    }
}

module.exports = GoalParser;
