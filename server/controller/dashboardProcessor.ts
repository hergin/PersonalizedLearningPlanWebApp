import DashboardParser from "../parser/dashboardParser";
import { StatusCode } from "../types";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";

export class DashboardAPI {
    parser : DashboardParser;
    errorCodeInterpreter : ErrorCodeInterpreter;

    constructor() {
        this.parser = new DashboardParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async createDashboard(profile_id : number) {
        try {
            await this.parser.storeDashboard(profile_id);
            return StatusCode.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async getDashboard(profile_id : number) {
        try {
            const dashboard = await this.parser.parseDashboard(profile_id);
            return (dashboard.length === 0) ? StatusCode.UNAUTHORIZED : dashboard[0];
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async updateDashboard(profile_id : number, dashboard_id : number) {
        try {
            await this.parser.updateDashboard(profile_id, dashboard_id);
            return StatusCode.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async deleteDashboard(dashboard_id : number) {
        try {
            await this.parser.deleteDashboard(dashboard_id);
            return StatusCode.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }
}
