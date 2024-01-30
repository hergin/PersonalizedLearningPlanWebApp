import { ProfileParser } from "../parser/profileParser";
import { STATUS_CODES } from "../utils/statusCodes";
import { ErrorCodeInterpreter } from "./errorCodeInterpreter";
import { Profile } from "../types";

export class ProfileAPI {
    parser : ProfileParser;
    errorCodeInterpreter : ErrorCodeInterpreter;

    constructor() {
        this.parser = new ProfileParser();
        this.errorCodeInterpreter = new ErrorCodeInterpreter();
    }

    async createProfile(username : string, firstName : string, lastName : string, email : string) {
        try {
            await this.parser.storeProfile(username, firstName, lastName, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async getProfile(email : string) {
        try {
            const profile = await this.parser.parseProfile(email);
            return (profile) ? profile : STATUS_CODES.UNAUTHORIZED;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async updateProfile(profile: Profile) {
        try {
            await this.parser.updateProfile(profile);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }

    async deleteProfile(profile_id : number) {
        try {
            await this.parser.deleteProfile(profile_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.errorCodeInterpreter.getStatusCode(error);
        }
    }
}

