export {};

import DashboardParser from '../../parser/dashboardParser';

const TEST_DATA = {
    email: "testdummy@yahoo.com",
    username: "testing_dummy",
    password: "01010101010",
    firstName: "Test",
    lastName: "Dummy",
    jobTitle: "Testing Dummy",
    bio: "...",
    profilePicture: ""
}

describe('dashboard parser', () => {
    var parser = new DashboardParser();
    var client : any;
    var profileId : number;

    beforeEach(async () => {
        console.log("Connecting...");
        client = await parser.pool.connect();
        console.log("Connected!");
        await client.query({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [TEST_DATA.email, TEST_DATA.password]
        });
        const accountId = await getAccountID();
        await createTestProfile(accountId);
        profileId = await getProfileID(accountId);
    });

    async function getAccountID(): Promise<number> {
        const queryResult = await client.query({
            text: "SELECT id FROM ACCOUNT WHERE email = $1 AND account_password = $2",
            values: [TEST_DATA.email, TEST_DATA.password]
        });
        return queryResult.rows[0].id;
    }

    async function createTestProfile(accountId : number): Promise<void> {
        await client.query({
            text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES($1, $2, $3, $4)",
            values: [TEST_DATA.username, TEST_DATA.firstName, TEST_DATA.lastName, accountId]
        });
    }

    async function getProfileID(accountId : number) {
        const query = {
            text: "SELECT profile_id FROM PROFILE WHERE account_id = $1",
            values: [accountId]
        };
        const result = await client.query(query);
        return result.rows[0].profile_id;
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

    it('parse dashboard', async () => {
        const actual = await parser.parseDashboard(profileId);
        expect(actual).toEqual([
            {
                dashboard_id: expect.any(Number),
                profile_id: profileId
            }
        ]);
    });

    it('delete dashboard', async () => {
        await client.query(
            'INSERT INTO DASHBOARD(profile_id) VALUES($1)',
            [profileId]
        );
        const dashboardID = await getDashboardID(profileId);
        await parser.deleteDashboard(dashboardID);
        const actual = await client.query(
            'SELECT * FROM DASHBOARD WHERE dashboard_id = $1',
            [dashboardID]
        );
        expect(actual.rows).toEqual([]);
    });

    async function getDashboardID(profileID : number) {
        const query = {
            text: "SELECT dashboard_id FROM DASHBOARD WHERE profile_id = $1",
            values: [profileID]
        };
        const result = await client.query(query);
        return result.rows[0].dashboard_id;
    }
});
