import DatabaseParser from "./databaseParser";

export default class DashboardParser extends DatabaseParser {
    constructor() {
        super()
    }

    async parseDashboard(profile_id : number) {
        console.log("Getting Dashboard...");
        const query = {
            text: "SELECT * FROM Dashboard WHERE profile_id = $1",
            values: [profile_id]
        };
        return this.parseDatabase(query);
    }

    async updateDashboard(profile_id : number, dashboard_id : number) {
        console.log("Inserting new data into Dashboard...");
        const query = {
            text: "UPDATE PROFILE SET profile_id = $1 WHERE dashboard_id = $2",
            values: [profile_id, dashboard_id]
        };
        await this.updateDatabase(query);
        console.log("Dashboard data saved!");
    }

    async deleteDashboard(dashboard_id : number) {
        console.log("Deleting Dashboard...");
        const query = {
            text: "DELETE FROM Dashboard WHERE dashboard_id = $1",
            values: [dashboard_id]
        };
        await this.updateDatabase(query);
    }
}
