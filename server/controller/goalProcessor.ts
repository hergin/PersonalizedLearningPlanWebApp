import { Goal } from "../types";

export {};

const GoalParser = require("../parser/goalParser");
const STATUS_CODES = require("../utils/statusCodes");
const ErrorCodeInterpreter = require("./errorCodeInterpreter");

class GoalAPI {
    parser : typeof GoalParser;
    errorCodeInterpreter : typeof ErrorCodeInterpreter;
    
    constructor() {
        this.parser = new GoalParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async getGoals(moduleId : number) {
        try {
            const goals = await this.parser.parseGoals(moduleId);
            return goals[0].goal_id ? goals : [];
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async createGoal(goal: Goal) {
        try {
            const results = await this.parser.storeGoal(goal);
            return results;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async updateGoal(goalId : number, name : string, description : string, isComplete : boolean, dueDate? : Date, completionTime? : Date, expiration? : Date) {
        try {
            await this.parser.updateGoal(goalId, name, description, isComplete, dueDate);
            if(completionTime) {
                await this.parser.updateGoalTimestamps(goalId, completionTime, expiration);
            }
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async deleteGoal(goalId : number) {
        try {
            await this.parser.deleteGoal(goalId);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async addSubGoal(parent_goal_id : number, name: string, description : string, is_complete : boolean) {
        try {
            const parentGoal = await this.parser.getGoal(parent_goal_id);
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }
}

module.exports = GoalAPI;
