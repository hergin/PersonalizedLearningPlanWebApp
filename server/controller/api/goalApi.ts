import GoalParser from "../../parser/goalParser";
import { StatusCode } from "../../types";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { Goal } from "../../types";
import { DatabaseError } from "pg";

export default class GoalAPI {
    parser: GoalParser;
    errorCodeInterpreter: ErrorCodeInterpreter;

    constructor() {
        this.parser = new GoalParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async getGoals(moduleId: number) {
        if(isNaN(moduleId)) {
            return StatusCode.BAD_REQUEST;
        }
        
        try {
            const parentGoals = await this.parser.parseParentGoals(moduleId);
            for (const goal of parentGoals) {
                const subGoals : Goal[] = await this.getSubGoals(goal.goal_id);
                if (subGoals?.length !== undefined && subGoals?.length !== 0) {
                    goal.sub_goals = subGoals;
                } else {
                    goal.sub_goals = [];
                }
            }
            console.log(parentGoals);
            return parentGoals;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async getSubGoals(goalID: number) {
        const subGoals = await this.parser.parseSubGoals(goalID);
        return subGoals;
    }

    async createGoal(goal: Goal) {
        const dueDate : string | undefined = this.#convertToPostgresTimestamp(goal.due_date);

        try {
            const results = await this.parser.storeGoal({
                ...goal,
                due_date: dueDate
            });
            return results;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError)
        }
    }

    #convertToPostgresTimestamp(time : string | undefined): string | undefined {
        return time?.replace('T', ' ').replace('Z', ' ');
    }

    async updateGoal(goal : Goal) {
        if(!goal.goal_id || isNaN(goal.goal_id)) {
            return StatusCode.BAD_REQUEST;
        }
        
        const dueDate : string | undefined = this.#convertToPostgresTimestamp(goal.due_date);
        const completionTime : string | undefined = this.#convertToPostgresTimestamp(goal.completion_time);
        const expiration : string | undefined = this.#convertToPostgresTimestamp(goal.expiration);

        try {
            await this.parser.updateGoal({...goal, due_date: dueDate});
            if (completionTime) {
                await this.parser.updateGoalTimestamps(goal.goal_id, completionTime, expiration);
            }
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async updateGoalFeedback(goalId: number, feedback: string) {
        if(isNaN(goalId)) {
            return StatusCode.BAD_REQUEST;
        }
        
        try {
            await this.parser.updateGoalFeedback(goalId, feedback);
            return StatusCode.OK;
        } catch(error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async deleteGoal(goalId: number) {
        if(isNaN(goalId)) {
            return StatusCode.BAD_REQUEST;
        }

        try {
            await this.parser.deleteGoal(goalId);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError)
        }
    }

    async getGoalVariable(goalId: number, variable: string) {
        if(isNaN(goalId)) {
            return StatusCode.BAD_REQUEST;
        }
        
        try {
            const result = await this.parser.parseGoalVariable(goalId, variable);
            return result;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError)
        }
    }

    async addSubGoal(parentGoalId: number, goal: Goal) {
        if(isNaN(parentGoalId)) {
            return StatusCode.BAD_REQUEST;
        }
        
        try {
            console.log(`In addSubGoal: ${JSON.stringify(goal)}`);
            const result = await this.parser.storeSubGoal(parentGoalId, goal);
            return result;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError)
        }
    }
}
