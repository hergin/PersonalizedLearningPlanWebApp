import GoalParser from "../../parser/goalParser";
import { STATUS_CODE, StatusCode, CreateGoalProps, Goal, ParentGoal } from "../../types";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { DatabaseError } from "pg";

export default class GoalAPI {
    readonly parser: GoalParser;

    constructor() {
        this.parser = new GoalParser();
    }

    async getGoals(moduleId: number): Promise<ParentGoal[] | StatusCode> {
        if (isNaN(moduleId)) {
            return STATUS_CODE.BAD_REQUEST;
        }

        try {
            const parentGoals = await this.parser.parseParentGoals(moduleId);
            for (const goal of parentGoals) {
                const subGoals: Goal[] = await this.parser.parseSubGoals(goal.goal_id);
                if (subGoals.length !== undefined && subGoals.length !== 0) {
                    goal.sub_goals = subGoals;
                } else {
                    goal.sub_goals = [];
                }
            }
            return parentGoals;
        } catch (error: unknown) {
            console.error(error);
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async createGoal(goal: CreateGoalProps): Promise<StatusCode> {
        const dueDate: string | undefined = this.convertToPostgresTimestamp(goal.due_date);

        try {
            await this.parser.storeGoal({
                ...goal,
                due_date: dueDate
            });
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            console.error(error);
            return convertDatabaseErrorToStatusCode(error as DatabaseError)
        }
    }

    private convertToPostgresTimestamp(time: string | undefined): string | undefined {
        return time?.replace('T', ' ').replace('Z', ' ');
    }

    async updateGoal(goal: Goal): Promise<StatusCode> {
        if (!goal.goal_id || isNaN(goal.goal_id)) {
            return STATUS_CODE.BAD_REQUEST;
        }

        const dueDate: string | undefined = this.convertToPostgresTimestamp(goal.due_date);
        const completionTime: string | undefined = this.convertToPostgresTimestamp(goal.completion_time);
        const expiration: string | undefined = this.convertToPostgresTimestamp(goal.expiration);

        try {
            await this.parser.updateGoal({...goal, due_date: dueDate, completion_time: completionTime, expiration: expiration});
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            console.error(error);
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async updateGoalFeedback(goalId: number, feedback: string): Promise<StatusCode> {
        if (isNaN(goalId)) {
            return STATUS_CODE.BAD_REQUEST;
        }

        try {
            await this.parser.updateGoalFeedback(goalId, feedback);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            console.error(error);
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async deleteGoal(goalId: number): Promise<StatusCode> {
        if (isNaN(goalId)) {
            return STATUS_CODE.BAD_REQUEST;
        }

        try {
            await this.parser.deleteGoal(goalId);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            console.error(error);
            return convertDatabaseErrorToStatusCode(error as DatabaseError)
        }
    }

    async getGoalVariable(goalId: number, variable: string): Promise<any[] | StatusCode> {
        if (isNaN(goalId)) {
            return STATUS_CODE.BAD_REQUEST;
        }

        try {
            const result = await this.parser.parseGoalVariable(goalId, variable);
            return result;
        } catch (error: unknown) {
            console.error(error);
            return convertDatabaseErrorToStatusCode(error as DatabaseError)
        }
    }
}
