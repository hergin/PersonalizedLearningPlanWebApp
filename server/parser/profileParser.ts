import DatabaseParser  from './databaseParser';
import { Profile } from "../types";

export default class ProfileParser extends DatabaseParser {
    constructor() {
        super();
    }

    async parseAllProfiles() {
        console.log("Getting all public user data...");
        return await this.parseDatabase("SELECT * FROM PUBLIC_USER_DATA");
    }

    async parseProfile(accountId : number) {
        console.log("Getting profile...");
        const query = {
            text: "SELECT * FROM PROFILE WHERE account_id = $1",
            values: [accountId]
        };
        const result = await this.parseDatabase(query);
        return result[0];
    }

    async storeProfile(username : string, firstName : string, lastName : string, accountId : number) {
        console.log("Creating profile...");
        console.log(accountId);
        const query = {
            text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES($1, $2, $3, $4)",
            values: [username, firstName, lastName, accountId]
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
