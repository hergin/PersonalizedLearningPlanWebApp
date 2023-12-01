const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");
const StatusCodes = require("./StatusCodes")

class DashboardAPI {
    constructor() {
        this.parser = new DatabaseParser();
        this.statusCode = new StatusCodes();
    }

    async createDashboard(profile_id) {
        try {
            await this.parser.storeDashboard(profile_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async getDashboard(profile_id) {
        try {
            const dashboard = await this.parser.parseDashboard(profile_id);
            return (dashboard.length === 0) ? STATUS_CODES.UNAUTHORIZED : dashboard[0];
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async updateDashboard(profile_id, dashboard_id) {
        try {
            await this.parser.updateDashboard(profile_id, dashboard_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async deleteDashboard(dashboard_id) {
        try {
            await this.parser.deleteDashboard(dashboard_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }
}

module.exports = DashboardAPI;