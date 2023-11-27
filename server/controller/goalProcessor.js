const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");

class GoalAPI {
    constructor() {
        this.parser = new DatabaseParser();
    }

    async getGoal(module_id) {
        try {
            const goal = await this.parser.parseGoal(module_id);
            return (goal.length === 0) ? STATUS_CODES.UNAUTHORIZED : module[0];
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async createGoal(name, description, completion, module_id) {
        try {
            await this.parser.storeGoal(name, description, completion, module_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async updateGoal(name, description, completion, module_id, goal_id) {
        try {
            await this.parser.updateGoal(name, description, completion, module_id, goal_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async deleteGoal(goal_id) {
        try {
            await this.parser.deleteGoal(goal_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    #getStatusCode(error) {
        switch(error.code) {
            case '23505':
                console.log("Duplicate data.");
                return STATUS_CODES.CONFLICT;
            case '08000': case '08003': case '08007':
                console.log("Connection error");
                return STATUS_CODES.CONNECTION_ERROR;
            default:
                console.error("Fatal server error.", error);
                return STATUS_CODES.INTERNAL_SERVER_ERROR;
        }
    }
}

module.exports = GoalAPI;