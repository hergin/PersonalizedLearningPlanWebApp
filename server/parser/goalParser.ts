import DatabaseParser from "./databaseParser";
import { generateInsertQuery, generateUpdateQuery } from "../utils/queryGenerator";
import { ClientGoal, ParentGoal, CreateGoalProps, Goal, Table } from "../types";

export default class GoalParser extends DatabaseParser {
    readonly tableName: Table = "GOAL";

    constructor() {
        super();
    }

    async parseParentGoals(moduleId: number): Promise<ParentGoal[]> {
        console.log("Getting Goals...");
        const query = {
            text: "SELECT * FROM get_goals($1) where parent_goal is null",
            values: [moduleId]
        };
        return await this.parseDatabase(query);
    }

    async parseGoalById(goalId: number): Promise<Goal[]> {
        console.log("Getting Goal...");
        const query = {
            text: "SELECT module_id FROM Goal where goal_id = $1",
            values: [goalId]
        };
        return this.parseDatabase(query);
    }

    async parseSubGoals(goalId: number): Promise<ClientGoal[]> {
        console.log("Getting sub goals...");
        const query = {
            text: "SELECT * FROM goal_with_tag WHERE parent_goal = $1",
            values: [goalId]
        };
        const result = await this.parseDatabase(query);
        console.log(`Parsed in sub goals: ${JSON.stringify(result)}`);
        return result;
    }

    async storeGoal(goal: CreateGoalProps): Promise<void> {
        console.log("Storing Goal...");
        const query = generateInsertQuery(goal, this.tableName);
        await this.updateDatabase(query);
    }

    async updateGoal(goal: Goal): Promise<void> {
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

    async deleteGoal(goalId: number): Promise<void> {
        console.log("Deleting Goal...");
        const query = {
            text: "DELETE FROM GOAL WHERE goal_id = $1",
            values: [goalId]
        };
        await this.updateDatabase(query);
        console.log("Goal successfully deleted!");
    }

    async parseGoalVariable(goalId: number, variable: string): Promise<unknown[]> {
        console.log(`Getting goal variable ${variable}...`);
        const query = {
            text: `SELECT ${variable} FROM GOAL WHERE goal_id = $1`,
            values: [goalId]
        };
        return this.parseDatabase(query);
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

    async runMaintenanceProcedures(): Promise<void> {
        console.log("Running goal's maintenance procedures...");
        await this.updateDatabase("CALL update_is_complete()");
    }
}
