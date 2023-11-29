const DatabaseParser = require("../parser/databaseParser");
const STATUS_CODES = require("../statusCodes");

class ProfileAPI {
    constructor() {
        this.parser = new DatabaseParser();
    }

    async createProfile(firstName, lastName, email) {
        try {
            await this.parser.storeProfile(firstName, lastName, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async getProfile(email) {
        try {
            const profile = await this.parser.parseProfile(email);
            return (profile.length === 0) ? STATUS_CODES.UNAUTHORIZED : profile;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    async updateProfile(firstName, lastName, profilePicture, jobTitle, bio, email) {
        try {
            await this.parser.updateProfileData(firstName, lastName, profilePicture, jobTitle, bio, email);
            return STATUS_CODES.OK;
        } catch(error) {
            return this.#getStatusCode(error);
        }
    }

    #getStatusCode(error) {
        switch(error.code) {
            case '23505':
                console.log("Duplicate data.");
                return STATUS_CODES.CONFLICT;
            case '08000': case '08003': case '08007':
                console.log("Connection error");
                return STATUS_CODES.CONNECTION_ERROR;
            case '23514':
                console.log("Bad data.");
                return STATUS_CODES.BAD_REQUEST;
            default:
                console.error("Fatal server error.", error);
                return STATUS_CODES.INTERNAL_SERVER_ERROR;
        }
    }
}

module.exports = ProfileAPI;
