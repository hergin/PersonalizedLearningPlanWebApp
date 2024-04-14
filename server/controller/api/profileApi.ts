import ProfileParser from "../../parser/profileParser";
import { convertDatabaseErrorToStatusCode } from "../../utils/errorHandlers";
import { Profile, STATUS_CODE } from "../../types";
import { DatabaseError } from "pg";

export default class ProfileAPI {
    readonly parser : ProfileParser;

    constructor() {
        this.parser = new ProfileParser();
    }

    async getAllCoachProfiles() {
        try {
            return await this.parser.parseCoachProfiles();
        } catch(error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async createProfile(username : string, firstName : string, lastName : string, accountId : number) {
        try {
            await this.parser.storeProfile(username, firstName, lastName, accountId);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async getProfile(accountId : number) {
        try {
            const profile = await this.parser.parseProfile(accountId);
            return profile ? profile : STATUS_CODE.UNAUTHORIZED;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async updateProfile(profile: Profile) {
        try {
            await this.parser.updateProfile(profile);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }

    async deleteProfile(profileId : number) {
        try {
            await this.parser.deleteProfile(profileId);
            return STATUS_CODE.OK;
        } catch (error: unknown) {
            return convertDatabaseErrorToStatusCode(error as DatabaseError);
        }
    }
}
