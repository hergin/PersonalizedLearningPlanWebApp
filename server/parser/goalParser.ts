export {};

const DatabaseParser = require("./databaseParser");

class GoalParser extends DatabaseParser {
    constructor() {
        super();
    }

    async parseGoals(module_id : number) {
        console.log("Getting Goals...");
        const query = {
            text: "SELECT * FROM get_goals($1)",
            values: [module_id]
        };
        return this.parseDatabase(query);
    }

    async storeGoal(name : string, description : string, isComplete : boolean, moduleID : number) {
        console.log("Storing Goal...");
        const query = {
            text: "INSERT INTO GOAL(name, description, is_complete, module_id) VALUES($1, $2, $3, $4)",
            values: [name, description, isComplete, moduleID]
        };
        await this.updateDatabase(query);
        console.log("Goal Stored! Now returning id...");
        const idQuery = {
            text: "SELECT goal_id FROM GOAL WHERE name = $1 AND description = $2 AND module_id = $3",
            values: [name, description, moduleID]
        }
        return this.parseDatabase(idQuery);
    }

    async updateGoal(goalID : number, name : string, description : string, isComplete : boolean) {
        console.log("Inserting updated data into Goal...");
        const query = {
            text: "UPDATE GOAL SET name = $1, description = $2, is_complete = $3 WHERE goal_id = $4",
            values: [name, description, isComplete, goalID]
        };
        await this.updateDatabase(query);
        console.log("Goal data updated!");
    }

    async updateGoalTimestamps(goalID : number, completionTime : string, expiration? : string) {
        console.log("Inserting timestamp values into Goal...");
        const queryString = `UPDATE GOAL SET completion_time = $1${expiration ? ", expiration = $2" : ""} WHERE goal_id = ${expiration ? "$3" : "$2"}`;
        const query = {
            text: queryString,
            values: expiration ? [completionTime, expiration, goalID] : [completionTime, goalID]
        };
        await this.updateDatabase(query);
        console.log("Timestamps updated!");
    }

    async deleteGoal(goalID : number) {
        console.log("Deleting Goal...");
        const query = {
            text: "DELETE FROM Goal WHERE goal_id = $1",
            values: [goalID]
        };
        await this.updateDatabase(query);
        console.log("Goal successfully deleted!");
    }

    async getModuleID(goalID : number) {
        console.log("Getting goal...");
        const query = {
            text: "SELECT module_id FROM get_goal($1)",
            values: [goalID]
        };
        return this.parseDatabase(query);
    }

    async storeSubGoal(parentGoalID : number, name: string, description : string, isComplete : boolean, moduleID : number) {
        console.log("Storing sub goal...");
        const query = {
            text: "INSERT INTO goal(name, description, is_complete, module_id, parent_goal) VALUES ($1, $2, $3, $4, $5)",
            values: [name, description, isComplete, moduleID, parentGoalID]
        };
        await this.updateDatabase(query);
        console.log("Sub goal stored! Now returning id...");
        const idQuery = {
            text: "SELECT goal_id FROM GOAL WHERE name = $1 AND description = $2 AND parent_goal = $3",
            values: [name, description, parentGoalID]
        }
        return this.parseDatabase(idQuery);
    }

    async parseSubGoals(goalID : number) {
        console.log("Getting sub goals...");
        const query = {
            text: "SELECT * FROM GOAL WHERE parent_goal = $1",
            values: [goalID]
        };
        return this.parseDatabase(query);
    }
}

module.exports = GoalParser;
