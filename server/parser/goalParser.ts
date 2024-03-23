import DatabaseParser from "./databaseParser";
import { Goal, Query } from "../types";

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
        const query = this.generateInsertQuery(goal);
        await this.updateDatabase(query);
        console.log("Goal Stored! Now returning id...");
        const idQuery = {
            text: "SELECT goal_id FROM GOAL WHERE name = $1 AND description = $2 AND module_id = $3",
            values: [goal.name, goal.description, goal.module_id]
        };
        return this.parseDatabase(idQuery);
    }
    
    private generateInsertQuery(goal: Goal): Query {
        var beginningText = "INSERT INTO GOAL(";
        var endingText = "VALUES (";
        var values : (string | number | boolean | Date | undefined)[] = [];
        Object.entries(goal).forEach((goalElement) => {
            const [variable, value] = goalElement;
            if(value === undefined || Array.isArray(value) || value === "") return;
            beginningText = beginningText.concat(`${variable}, `);
            values.push(value);
            endingText = endingText.concat(`$${values.length}, `);
        });
        beginningText = beginningText.slice(0, beginningText.length - 2).concat(") ");
        endingText = endingText.slice(0, endingText.length - 2).concat(")");
        const finalText = beginningText.concat(endingText);
        console.log(`Final Query: ${finalText}`);
        return {
            text: finalText,
            values: values
        };
    }

    async updateGoal(goal: Goal) {
        console.log("Inserting updated data into Goal...");
        const query = this.generateUpdateQuery(goal);
        console.log(JSON.stringify(query));
        await this.updateDatabase(query);
        console.log("Goal data updated!");
    }

    private generateUpdateQuery(goal: Goal): Query {
        var text = "UPDATE GOAL SET ";
        var values : (string | number | boolean | Date | undefined)[] = [];
        Object.entries(goal).forEach((goalElement) => {
            const [variable, value] = goalElement;
            if(variable === "goal_id" || value === undefined || Array.isArray(value) || value === "") return;
            values.push(value);
            text = text.concat(`${variable} = $${values.length}, `);
        });
        values.push(goal.goal_id);
        const finalText = text.slice(0, text.length - 2).concat(` WHERE goal_id = $${values.length}`);
        console.log(`Final Query: ${finalText}`);
        return {
            text: finalText,
            values: values
        };
    }

    async updateGoalFeedback(goalID: number, feedback: string) {
        console.log(`Updating feedback on goal ${goalID}`);
        const query = {
            text: "UPDATE GOAL SET feedback = $1 WHERE goal_id = $2",
            values: [feedback, goalID]
        };
        await this.updateDatabase(query);
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
        console.log(result);
        // I have no idea why, but I keep getting duplicates when retrieving test values specifically.
        return this.getRidOfDuplicates(result);
    }

    private async getRidOfDuplicates(result: any[]): Promise<any[]> {
        const previousGoals : number[] = []; 
        const filtered = result.filter((element) => {
            const result : boolean = !previousGoals.includes(element.id);
            if(result) previousGoals.push(element.id);
            return result;
        });    
        return filtered;
    }

    async runMaintenanceProcedures() {
        console.log("Running goal's maintenance procedures...");
        await this.updateDatabase("CALL update_is_complete()");
    }
}
