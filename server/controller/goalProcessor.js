const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");
const StatusCodes = require("./StatusCodes");

class GoalAPI {
    constructor() {
        this.parser = new DatabaseParser();
        this.statusCode = new StatusCodes();
    }

    async getGoal(module_id) {
        try {
            const goal = await this.parser.parseGoal(module_id);
            return (goal.length === 0) ? STATUS_CODES.UNAUTHORIZED : goal[0];
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