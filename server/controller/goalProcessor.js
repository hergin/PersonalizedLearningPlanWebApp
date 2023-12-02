const GoalParser = require("../parser/goalParser");
const STATUS_CODES = require("../utils/statusCodes");
const StatusCodes = require("./StatusCodes");

class GoalAPI {
    constructor() {
        this.parser = new GoalParser();
        this.statusCode = new StatusCodes();
    }

    async getGoals(module_id) {
        try {
            const goals = await this.parser.parseGoals(module_id);
            return goals;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async createGoal(name, description, completion_perc, module_id) {
        try {
            await this.parser.storeGoal(name, description, completion_perc, module_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async updateGoal(name, description, completion, module_id, goal_id) {
        try {
            await this.parser.updateGoal(name, description, completion, module_id, goal_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async deleteGoal(goal_id) {
        try {
            await this.parser.deleteGoal(goal_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }
}

module.exports = GoalAPI;