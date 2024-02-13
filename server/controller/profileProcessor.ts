import ProfileParser from "../parser/profileParser";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { Profile, StatusCode } from "../types";

export class ProfileAPI {
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
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async getProfile(accountId : number) {
        try {
            const profile = await this.parser.parseProfile(accountId);
            return profile ? profile : StatusCode.UNAUTHORIZED;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async updateProfile(profile: Profile) {
        try {
            await this.parser.updateProfile(profile);
            return StatusCode.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async deleteProfile(profileId : number) {
        try {
            await this.parser.deleteProfile(profileId);
            return StatusCode.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }
}

