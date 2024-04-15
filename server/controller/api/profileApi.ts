import DatabaseParser from "../../parser/databaseParser";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { CreateProfileProps, Profile, STATUS_CODE } from "../../types";
import { DatabaseError } from "pg";

export default class ProfileAPI {
    readonly parser : DatabaseParser;

    constructor() {
        this.parser = new DatabaseParser();
    }

    async getAllCoachProfiles() {
        try {
            return await this.parser.parseDatabase("SELECT * FROM COACH_DATA");
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async createProfile(profile: CreateProfileProps) {
        try {
            await this.parser.updateDatabase({
                text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES($1, $2, $3, $4)",
                values: [profile.username, profile.firstName, profile.lastName, profile.accountId]
            });
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async getProfile(accountId : number) {
        try {
            const profile = await this.parser.parseDatabase({
                text: "SELECT * FROM PROFILE WHERE account_id = $1",
                values: [accountId]
            });
            return profile ?? STATUS_CODE.GONE;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async updateProfile(profile: Profile) {
        try {
            await this.parser.updateDatabase({
                text: "UPDATE PROFILE SET username = $1, first_name = $2, last_name = $3, job_title = $4, bio = $5 WHERE profile_id = $6",
                values: [profile.username, profile.firstName, profile.lastName, profile.jobTitle, profile.bio, profile.profileId]
            });
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async deleteProfile(id : number) {
        try {
            await this.parser.updateDatabase({
                text: "DELETE FROM Profile WHERE profile_id = $1",
                values: [id]
            });
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}
