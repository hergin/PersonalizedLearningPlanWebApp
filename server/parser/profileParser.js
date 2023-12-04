const DatabaseParser = require('./databaseParser');

class ProfileParser extends DatabaseParser {
    async parseProfile(email) {
        console.log("Getting profile...");
        const client = await this.pool.connect();
        const query = {
            text: "SELECT * FROM PROFILE WHERE email = $1",
            values: [email]
        };
        const result = await client.query(query);
        client.release();
        console.log("Found profile!");
        return result.rows[0];
    }

    async storeProfile(username, firstName, lastName, email) {
        console.log("Creating profile...");
        console.log(email);
        const client = await this.pool.connect();
        const query = {
            text: "INSERT INTO PROFILE(username, first_name, last_name, email) VALUES($1, $2, $3, $4)",
            values: [username, firstName, lastName, email]
        };
        await client.query(query);
        client.release();
        console.log("Profile Created!");
    }

    async updateProfile(id, username, firstName, lastName, profilePicture, jobTitle, bio) {
        console.log("Inserting new data into profile...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE PROFILE SET username = $1, first_name = $2, last_name = $3, profile_picture = $4, job_title = $5, bio = $6 WHERE profile_id = $7",
            values: [username, firstName, lastName, profilePicture, jobTitle, bio, id]
        };
        await client.query(query);
        client.release();
        console.log("Profile data saved!");
    }

    async deleteProfile(profile_id) {
        console.log("Deleting Profile...");
        const client = await this.pool.connect();
        const query = {
            text: "DELETE FROM Profile WHERE profile_id = $1",
            values: [profile_id]
        };
        const result = await client.query(query);
        client.release();
        console.log("Deleted Profile!");
        return result.rows;
    }
}

module.exports = ProfileParser;
