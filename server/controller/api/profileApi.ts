import ProfileParser from "../../parser/profileParser";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { Profile, StatusCode, User } from "../../types";
import { DatabaseError } from "pg";

export default class ProfileAPI {
    parser : ProfileParser;
    errorCodeInterpreter : ErrorCodeInterpreter;

    constructor() {
        this.parser = new ProfileParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async createProfile(username : string, firstName : string, lastName : string, accountId : number) {
        try {
            await this.parser.storeProfile(username, firstName, lastName, accountId);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async getProfile(accountId : number) {
        try {
            const profile = await this.parser.parseProfile(accountId);
            return profile ? profile : StatusCode.UNAUTHORIZED;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async updateProfile(profile: Profile) {
        try {
            await this.parser.updateProfile(profile);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async deleteProfile(profileId : number) {
        try {
            await this.parser.deleteProfile(profileId);
            return StatusCode.OK;
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }

    async getUserData(accountId: number): Promise<User | StatusCode> {
        try {
            const result = await this.parser.parseUserData(accountId);
            return result[0];
        } catch (error: unknown) {
            return this.errorCodeInterpreter.getStatusCode(error as DatabaseError);
        }
    }
}
