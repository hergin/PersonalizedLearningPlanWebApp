export {};

import ProfileParser from '../../parser/profileParser';

const TEST_DATA = {
    email: "testdummy@yahoo.com",
    username: "test_dummy",
    password: "01010101010",
    refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa",
    firstName: "Test",
    lastName: "Dummy",
    jobTitle: "Testing Dummy",
    bio: "...",
    profilePicture: ""
}

describe('profile parser tests', () => {
    const parser = new ProfileParser();
    var client : any;
    var accountID : number;

    beforeEach(async () => {
        client = await parser.pool.connect();
        await client.query({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [TEST_DATA.email, TEST_DATA.password]
        });
        accountID = await getAccountID();
    });

    async function getAccountID(): Promise<number> {
        const queryResult = await client.query({
            text: "SELECT id FROM ACCOUNT WHERE email = $1 AND account_password = $2",
            values: [TEST_DATA.email, TEST_DATA.password]
        });
        return queryResult.rows[0].id;
    }

    async function createTestProfile() {
        await client.query({
            text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES($1, $2, $3, $4)",
            values: [TEST_DATA.username, TEST_DATA.firstName, TEST_DATA.lastName, accountID]
        });
    }

    afterEach(async () => {
        await client.query(
            "DELETE FROM ACCOUNT WHERE email = $1 AND account_password = $2",
            [TEST_DATA.email, TEST_DATA.password]
        );
        client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });

    it('store profile', async () => {
        await parser.storeProfile(TEST_DATA.username, TEST_DATA.firstName, TEST_DATA.lastName, accountID);
        var query = await client.query(
            "SELECT * FROM PROFILE WHERE username = $1 AND first_name = $2 AND last_name = $3 AND account_id = $4",
            [TEST_DATA.username, TEST_DATA.firstName, TEST_DATA.lastName, accountID]
        );
        expect(query.rows).toEqual([
            {
                profile_id: expect.any(Number),
                username: TEST_DATA.username, 
                first_name: TEST_DATA.firstName, 
                last_name: TEST_DATA.lastName,
                profile_picture: null,
                job_title: null,
                bio: null,
                account_id: accountID
            }
        ]);
    });
    
    it('parse profile', async () => {
        createTestProfile();
        var actual = await parser.parseProfile(accountID);
        expect(actual).toEqual({
                profile_id: expect.any(Number),
                username: TEST_DATA.username,
                first_name: TEST_DATA.firstName, 
                last_name: TEST_DATA.lastName,
                profile_picture: null,
                job_title: null,
                bio: null,
                account_id: accountID
        });
    });

    it('update profile', async () => {
        createTestProfile();
        const profileID = await getProfileID();
        await parser.updateProfile({
            id: profileID, 
            username: TEST_DATA.username, 
            firstName: TEST_DATA.firstName, 
            lastName: TEST_DATA.lastName, 
            profilePicture: TEST_DATA.profilePicture, 
            jobTitle: TEST_DATA.jobTitle, 
            bio: TEST_DATA.bio
        });
        var actual = await client.query(
            "SELECT * FROM PROFILE WHERE profile_id = $1",
            [profileID]
        );
        expect(actual.rows).toEqual([
            {
                profile_id: profileID,
                username: TEST_DATA.username,
                first_name: TEST_DATA.firstName,
                last_name: TEST_DATA.lastName,
                profile_picture: TEST_DATA.profilePicture,
                job_title: TEST_DATA.jobTitle,
                bio: TEST_DATA.bio,
                account_id: accountID
            }
        ]);
    });

    it('delete profile', async () => {
        createTestProfile();
        const profileID = await getProfileID();
        await parser.deleteProfile(profileID);
        const actual = await client.query(
            'SELECT * FROM PROFILE WHERE profile_id = $1',
            [profileID]
        );
        expect(actual.rows).toEqual([]);
    });

    async function getProfileID() {
        const query = {
            text: "SELECT profile_id FROM PROFILE WHERE account_id = $1",
            values: [accountID]
        };
        const result = await client.query(query);
        return result.rows[0].profile_id;
    }
});
