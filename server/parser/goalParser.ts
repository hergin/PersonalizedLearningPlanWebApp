import DatabaseParser from "./databaseParser";
import { generateInsertQuery, generateUpdateQuery } from "../utils/queryGenerator";
import { Goal, Table } from "../types";

export default class GoalParser extends DatabaseParser {
    readonly tableName: Table = "GOAL";

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

    async parseGoalById(goalId: number) {
        console.log("Getting Goal...");
        const query = {
            text: "SELECT module_id FROM Goal where goal_id = $1",
            values: [goalId]
        };
        return this.parseDatabase(query);
    }

    async parseSubGoals(goalID: number) {
        console.log("Getting sub goals...");
        const query = {
            text: "SELECT * FROM goal_with_tag WHERE parent_goal = $1",
            values: [goalID]
        };
        const result = await this.parseDatabase(query);
        console.log(`Parsed in sub goals: ${JSON.stringify(result)}`);
        return result;
    }

    async storeGoal(goal: Goal) {
        console.log("Storing Goal...");
        const query = generateInsertQuery(goal, this.tableName);
        await this.updateDatabase(query);
    }

    async updateGoal(goal: Goal) {
        console.log("Inserting updated data into Goal...");
        const query = generateUpdateQuery(goal, this.tableName, "goal_id");
        console.log(`Generated update query: ${JSON.stringify(query)}`);
        await this.updateDatabase(query);
        console.log("Goal data updated!");
    }

    async updateGoalFeedback(goalID: number, feedback: string) {
        console.log(`Updating feedback on goal ${goalID}`);
        const query = {
            text: "UPDATE GOAL SET feedback = $1 WHERE goal_id = $2",
            values: [feedback, goalID]
        };
        await this.updateDatabase(query);
    }

    async deleteGoal(goalID: number) {
        console.log("Deleting Goal...");
        const query1 = {
            text: "DELETE FROM GOAL WHERE parent_goal = $1",
            values: [goalID]
        };
        const query2 = {
            text: "DELETE FROM GOAL WHERE goal_id = $1",
            values: [goalID]
        };
        await this.updateDatabase(query1);
        await this.updateDatabase(query2);
        console.log("Goal successfully deleted!");
    }

    async parseGoalVariable(goalID: number, variable: string) {
        console.log(`Getting goal variable ${variable}...`);
        const query = {
            text: `SELECT ${variable} FROM GOAL WHERE goal_id = $1`,
            values: [goalID]
        };
        return this.parseDatabase(query);
    }

    async storeSubGoal(parentGoalID: number, goal: Goal) {
        console.log("Storing sub goal...");
        const text = `INSERT INTO GOAL(name, description, goal_type, is_complete, module_id, tag_id, parent_goal${goal.due_date ? ", due_date" : ""}) VALUES ($1, $2, $3, $4, $5, $6, $7${goal.due_date ? `, $8` : ""})`;
        const query = {
            text: text,
            values: goal.due_date ? [goal.name, goal.description, goal.goal_type, goal.is_complete, goal.module_id, goal.tag_id, parentGoalID, goal.due_date] :
                [goal.name, goal.description, goal.goal_type, goal.is_complete, goal.module_id, goal.tag_id, parentGoalID]
        };
        await this.updateDatabase(query);
        console.log("Sub goal stored! Now returning id...");
        const idQuery = {
            text: "SELECT goal_id FROM GOAL WHERE name = $1 AND description = $2 AND parent_goal = $3",
            values: [goal.name, goal.description, parentGoalID]
        };
        return this.parseDatabase(idQuery);
    }

    async parseAccountsWithUpcomingDueDates() {
        console.log("Getting information about upcoming due dates...");
        const query = `
            SELECT g.goal_id as id, g.name as goal, p.username as username, a.email as email, g.due_date as due_date
            FROM GOAL g JOIN MODULE m USING (module_id) JOIN ACCOUNT a ON a.id = m.account_id JOIN PROFILE p ON a.id = p.account_id JOIN ACCOUNT_SETTINGS s ON s.account_id = a.id
            WHERE g.due_date IS NOT NULL AND g.is_complete IS FALSE AND s.receive_emails IS TRUE AND g.due_date <= (CURRENT_TIMESTAMP + INTERVAL '24 hours') AND g.due_date > CURRENT_TIMESTAMP;
        `;
        const result = await this.parseDatabase(query);
        // When testing, duplicates keep being received.
        return this.getRidOfDuplicates(result);
    }

    private async getRidOfDuplicates(result: any[]): Promise<any[]> {
        const previousGoals: number[] = [];
        const filtered = result.filter((element) => {
            const result: boolean = !previousGoals.includes(element.id);
            if (result) previousGoals.push(element.id);
            return result;
        });
        return filtered;
    }

    async runMaintenanceProcedures() {
        console.log("Running goal's maintenance procedures...");
        await this.updateDatabase("CALL update_is_complete()");
    }
}
