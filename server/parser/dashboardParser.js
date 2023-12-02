const DatabaseParser = require("./databaseParser");

class DashboardParser extends DatabaseParser {
    async parseDashboard(profile_id) {
        console.log("Getting Dashboard...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM Dashboard WHERE profile_id = $1",
            values: [profile_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Found Dashboard!");
        return result.rows;
    }

    async storeDashboard(profile_id) {
        console.log("Creating Dashboard...");
        const client = await this.pool.connect();
        const query = {
            text: "INSERT INTO Dashboard(profile_id) VALUES($1)",
            values: [profile_id]
        };
        await client.query(query);
        client.release();
        console.log("Dashboard Created!");
    }

    async updateDashboard(profile_id, dashboard_id) {
        console.log("Inserting new data into Dashboard...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE PROFILE SET profile_id = $1 WHERE dashboard_id = $2",
            values: [profile_id, dashboard_id]
        };
        await client.query(query);
        client.release();
        console.log("Dashboard data saved!");
    }

    async deleteDashboard(dashboard_id) {
        console.log("Deleting Dashboard...");
        const client = await this.pool.connect();
        const query = {
            text: "DELETE FROM Dashboard WHERE dashboard_id = $1",
            values: [dashboard_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Deleted Dashboard!");
        return result.rows;
    }
}

module.exports = DashboardParser;
