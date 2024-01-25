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

    async getGoals(module_id : number) {
        try {
            const goals = await this.parser.parseGoals(module_id);
            return goals;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async createGoal(name : string, description : string, goalType: string, is_complete : boolean, module_id : number, dueDate? : Date) {
        try {
            const results = await this.parser.storeGoal(name, description, goalType, is_complete, module_id, dueDate);
            return results;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async updateGoal(goal_id : number, name : string, description : string, is_complete : boolean, dueDate? : Date, completionTime? : Date, expiration? : Date) {
        try {
            await this.parser.updateGoal(goal_id, name, description, is_complete, dueDate);
            if(completionTime) {
                await this.parser.updateGoalTimestamps(goal_id, completionTime, expiration);
            }
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async deleteGoal(goal_id : number) {
        try {
            await this.parser.deleteGoal(goal_id);
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
