export {};

import ProfileParser from '../profileParser';
import { Pool } from 'pg';

jest.mock("pg");

const TEST_PROFILE = {
    profileId: 1,
    username: "Xx_TestDummy_xX",
    firstName: "Test",
    lastName: "Dummy",
    profilePicture: "",
    jobTitle: "Testing Dummy",
    bio: "...",
    accountId: 0,
}

describe('profile parser tests', () => {
    const parser = new ProfileParser();
    var mockQuery : any;

    beforeEach(async () => {
        mockQuery = new Pool().query;
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('store profile', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.storeProfile(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_PROFILE.accountId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES($1, $2, $3, $4)",
            values: [TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_PROFILE.accountId]
        });
    });

    it('parse all profiles', async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_PROFILE, TEST_PROFILE]});
        var actual = await parser.parseAllProfiles();
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM PUBLIC_USER_DATA");
        expect(actual).toEqual([TEST_PROFILE, TEST_PROFILE]);
    });
    
    it('parse profile', async () => {
        mockQuery.mockResolvedValueOnce([TEST_PROFILE]);
        var actual = await parser.parseProfile(TEST_PROFILE.accountId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM PROFILE WHERE account_id = $1",
            values: [TEST_PROFILE.accountId]
        });
        expect(actual).toEqual([TEST_PROFILE]);
    });

    it('update profile', async () => {
        const updatedBio = "updated";
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.updateProfile({...TEST_PROFILE, bio: updatedBio});
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "UPDATE PROFILE SET username = $1, first_name = $2, last_name = $3, profile_picture = $4, job_title = $5, bio = $6 WHERE profile_id = $7",
            values: [TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_PROFILE.profilePicture, TEST_PROFILE.jobTitle, TEST_PROFILE.bio, TEST_PROFILE.profileId]
        });        
    });

    it('delete profile', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.deleteProfile(TEST_PROFILE.profileId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "DELETE FROM Profile WHERE profile_id = $1",
            values: [TEST_PROFILE.profileId]
        });
    });
});
