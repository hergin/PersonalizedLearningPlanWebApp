import ProfileParser from "../parser/profileParser";
import { STATUS_CODES } from "../utils/statusCodes";
import ErrorCodeInterpreter from "./errorCodeInterpreter";

export default class ProfileAPI {
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

    async updateProfile(profile_id : number, username : string, firstName : string, lastName : string, profilePicture : string, jobTitle : string, bio : string) {
        try {
            await this.parser.updateProfile(profile_id, username, firstName, lastName, profilePicture, jobTitle, bio);
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
