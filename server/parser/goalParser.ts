import DatabaseParser from "./databaseParser";
import { Goal, GoalType } from "../types";

const TIMESTAMP_FORMAT : string = "YYYY-MM-DD HH24:MI:SS"

export default class GoalParser extends DatabaseParser {
    constructor() {
        super();
    }

    async parseParentGoals(moduleId: number) {
        console.log("Getting Goals...");
        const query = {
            text: "SELECT * FROM get_goals($1) where parent_goal is null",
            values: [moduleId]
        };
        return this.parseDatabase(query);
    }

    async storeGoal(goal: Goal) {
        console.log("Storing Goal...");
        const query = {
            text: `INSERT INTO GOAL(name, description, goal_type, is_complete, module_id${goal.dueDate ? ", due_date" : ""}) VALUES($1, $2, $3, $4, $5${goal.dueDate ? ", $6" : ""})`,
            values: goal.dueDate ?
                [goal.name, goal.description, goal.goalType, goal.isComplete, goal.moduleId, goal.dueDate] :
                [goal.name, goal.description, goal.goalType, goal.isComplete, goal.moduleId]
        };
        await this.updateDatabase(query);
        console.log("Goal Stored! Now returning id...");
        const idQuery = {
            text: "SELECT goal_id FROM GOAL WHERE name = $1 AND description = $2 AND module_id = $3",
            values: [goal.name, goal.description, goal.moduleId]
        }
        return this.parseDatabase(idQuery);
    }

    async updateGoal(goalID: number, name: string, description: string, goalType: GoalType, isComplete: boolean, dueDate?: string) {
        console.log("Inserting updated data into Goal...");
        const query = {
            text: `UPDATE GOAL SET name = $1, description = $2, goal_type = $3, is_complete = $4${dueDate ? `, due_date = $6` : ""} WHERE goal_id = $5`,
            values: dueDate ? [name, description, goalType, isComplete, goalID, dueDate] : [name, description, goalType, isComplete, goalID]
        };
        console.log(JSON.stringify(query));
        await this.updateDatabase(query);
        console.log("Goal data updated!");
    }

    async updateGoalTimestamps(goalID: number, completionTime: string, expiration?: string) {
        console.log("Inserting timestamp values into Goal...");
        const queryString = `UPDATE GOAL SET completion_time = $1${expiration ? `, expiration = $3` : ""} WHERE goal_id = $2`;
        const query = {
            text: queryString,
            values: expiration ? [completionTime, goalID, expiration] : [completionTime, goalID]
        };
        await this.updateDatabase(query);
        console.log("Timestamps updated!");
    }

    async deleteGoal(goalID: number) {
        console.log("Deleting Goal...");
        const query1 = {
            text: "DELETE FROM Goal WHERE parent_goal = $1",
            values: [goalID]
        };
        const query2 = {
            text: "DELETE FROM Goal WHERE goal_id = $1",
            values: [goalID]
        };
        await this.updateDatabase(query1);
        await this.updateDatabase(query2);
        console.log("Goal successfully deleted!");
    }

    async parseGoalVariable(goalID: number, variable: string) {
        console.log(`Getting goal variable ${variable}...`);
        const query = {
            text: `SELECT ${variable} FROM get_goal($1)`,
            values: [goalID]
        };
        return this.parseDatabase(query);
    }

    async storeSubGoal(parentGoalID: number, goal: Goal) {
        console.log("Storing sub goal...");
        const text = `INSERT INTO goal(name, description, goal_type, is_complete, module_id, parent_goal${goal.dueDate ? ", due_date" : ""}) VALUES ($1, $2, $3, $4, $5, $6${goal.dueDate ? `, $7` : ""})`;
        const query = {
            text: text,
            values: goal.dueDate ? [goal.name, goal.description, goal.goalType, goal.isComplete, goal.moduleId, parentGoalID, goal.dueDate] :
                [goal.name, goal.description, goal.goalType, goal.isComplete, goal.moduleId, parentGoalID]
        };
        console.log(JSON.stringify(query));
        await this.updateDatabase(query);
        console.log("Sub goal stored! Now returning id...");
        const idQuery = {
            text: "SELECT goal_id FROM GOAL WHERE name = $1 AND description = $2 AND parent_goal = $3",
            values: [goal.name, goal.description, parentGoalID]
        }
        return this.parseDatabase(idQuery);
    }

    async parseSubGoals(goalID: number) {
        console.log("Getting sub goals...");
        const query = {
            text: "SELECT * FROM GOAL WHERE parent_goal = $1",
            values: [goalID]
        };
        return this.parseDatabase(query);
    }

    async parseAllSubGoals() {
        console.log("Getting every sub goal...");
        return this.parseDatabase("SELECT * FROM GOAL WHERE parent_goal IS NOT NULL");
    }

    async parseAllParentGoals() {
        console.log("Getting all parent goals...");
        return this.parseDatabase("SELECT * FROM GOAL WHERE parent_goal IS NULL");
    }
}
