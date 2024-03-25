import ProfileParser from '../profileParser';
import { Pool } from 'pg';
import { Profile } from '../../types';

jest.mock("pg");

const TEST_PROFILE: Profile = {
    username: "Xx_TestDummy_xX",
    firstName: "Test",
    lastName: "Dummy",
    profilePicture: "",
    jobTitle: "Testing Dummy",
    bio: "...",
    accountId: 0,
}
const mockAccountId = 0;
const mockProfileId = 1;

describe('profile parser tests', () => {
    const parser = new ProfileParser();
    var mockQuery : jest.Mock<any, any, any>;

    beforeEach(async () => {
        mockQuery = new Pool().query as jest.Mock<any, any, any>;
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('store profile', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.storeProfile(TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, mockAccountId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES($1, $2, $3, $4)",
            values: [TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, mockAccountId]
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
        mockQuery.mockResolvedValueOnce({rows: [TEST_PROFILE]});
        var actual = await parser.parseProfile(mockAccountId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM PROFILE WHERE account_id = $1",
            values: [mockAccountId]
        });
        expect(actual).toEqual(TEST_PROFILE);
    });

    it('update profile', async () => {
        const updatedBio = "updated";
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.updateProfile({...TEST_PROFILE, bio: updatedBio, profileId: mockProfileId});
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "UPDATE PROFILE SET username = $1, first_name = $2, last_name = $3, profile_picture = $4, job_title = $5, bio = $6 WHERE profile_id = $7",
            values: [TEST_PROFILE.username, TEST_PROFILE.firstName, TEST_PROFILE.lastName, TEST_PROFILE.profilePicture, TEST_PROFILE.jobTitle, updatedBio, mockProfileId]
        });        
    });

    it('delete profile', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.deleteProfile(mockProfileId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "DELETE FROM Profile WHERE profile_id = $1",
            values: [mockProfileId]
        });
    });
});
