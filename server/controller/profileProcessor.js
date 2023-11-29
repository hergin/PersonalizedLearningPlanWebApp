const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");
const StatusCodes = require("./StatusCodes")

class ProfileAPI {
    constructor() {
        this.parser = new DatabaseParser();
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
            return (profile.length === 0) ? STATUS_CODES.UNAUTHORIZED : profile[0];
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }

    async updateProfile(firstName, lastName, profilePicture, jobTitle, bio, email) {
        try {
            await this.parser.updateProfileData(firstName, lastName, profilePicture, jobTitle, bio, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.statusCode.getStatusCode(error);
        }
    }
}

module.exports = ProfileAPI;
