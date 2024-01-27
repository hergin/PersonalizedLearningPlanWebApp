import {Profile} from "../types";

export {};

const DatabaseParser = require('./databaseParser');

class ProfileParser extends DatabaseParser {
    constructor() {
        super();
    }

    async parseProfile(email : string) {
        console.log("Getting profile...");
        const query = {
            text: "SELECT * FROM PROFILE WHERE email = $1",
            values: [email]
        };
        const result = await this.parseDatabase(query);
        return result[0];
    }

    async storeProfile(username : string, firstName : string, lastName : string, email : string) {
        console.log("Creating profile...");
        console.log(email);
        const query = {
            text: "INSERT INTO PROFILE(username, first_name, last_name, email) VALUES($1, $2, $3, $4)",
            values: [username, firstName, lastName, email]
        };
        await this.updateDatabase(query);
        console.log("Profile Created!");
    }

    async updateProfile(profile: Profile) {
        console.log("Inserting new data into profile...");
        const query = {
            text: "UPDATE PROFILE SET username = $1, first_name = $2, last_name = $3, profile_picture = $4, job_title = $5, bio = $6 WHERE profile_id = $7",
            values: [profile.username, profile.firstName, profile.lastName, profile.profilePicture, profile.jobTitle, profile.bio, profile.id]
        };
        await this.updateDatabase(query);
        console.log("Profile data saved!");
    }

    async deleteProfile(profile_id : number) {
        console.log("Deleting Profile...");
        const query = {
            text: "DELETE FROM Profile WHERE profile_id = $1",
            values: [profile_id]
        };
        await this.updateDatabase(query);
    }
}

module.exports = ProfileParser;
