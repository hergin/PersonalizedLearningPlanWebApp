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
        return result.rows;
    }

    async storeProfile(firstName, lastName, email) {
        console.log("Creating profile...");
        const client = await this.pool.connect();
        const query = {
            text: "INSERT INTO PROFILE(firstName, lastName, email) VALUES($1, $2, $3)",
            values: [firstName, lastName, email]
        };
        await client.query(query);
        client.release();
        console.log("Profile Created!");
    }

    async updateProfile(firstName, lastName, profilePicture, jobTitle, bio, email) {
        console.log("Inserting new data into profile...");
        const client = await this.pool.connect();
        const query = {
            text: "UPDATE PROFILE SET firstName = $1, lastName = $2, profilePicture = $3, jobTitle = $4, bio = $5 WHERE email = $6",
            values: [firstName, lastName, profilePicture, jobTitle, bio, email]
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
