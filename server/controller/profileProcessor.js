const ProfileParser = require("../parser/profileParser");
const STATUS_CODES = require("../utils/statusCodes");
const StatusCodes = require("./StatusCodes")

class ProfileAPI {
    constructor() {
        this.parser = new ProfileParser();
        this.statusCode = new StatusCodes();
    }

    async createProfile(firstName, lastName, email) {
        try {
            await this.parser.storeProfile(firstName, lastName, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async getProfile(email) {
        try {
            const profile = await this.parser.parseProfile(email);
            return (profile) ? profile : STATUS_CODES.UNAUTHORIZED;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async updateProfile(firstName, lastName, profilePicture, jobTitle, bio, email, profile_id) {
        try {
            await this.parser.updateProfile(firstName, lastName, profilePicture, jobTitle, bio, email, profile_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async deleteProfile(profile_id) {
        try {
            await this.parser.deleteProfile(profile_id);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }
}

module.exports = ProfileAPI;
