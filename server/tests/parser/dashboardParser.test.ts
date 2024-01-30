export {};

import { DashboardParser } from '../../parser/dashboardParser';

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

const CREATE_ACCOUNT_QUERY = {
    text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
    values: [TEST_DATA.email, TEST_DATA.password]
}

const CREATE_PROFILE_QUERY = {
    text: "INSERT INTO PROFILE(username, first_name, last_name, email) VALUES($1, $2, $3, $4)",
    values: [TEST_DATA.username, TEST_DATA.firstName, TEST_DATA.lastName, TEST_DATA.email]
}

describe('dashboard parser', () => {
    var parser = new DashboardParser();
    var client : any;

    beforeEach(async () => {
        console.log("Connecting...");
        client = await parser.pool.connect();
        console.log("Connected!");
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_PROFILE_QUERY);
    });

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

    it('create dashboard', async () => {
        const profileID = await getProfileID();
        await parser.storeDashboard(profileID);
        const actual = await client.query(
            'SELECT * FROM DASHBOARD WHERE profile_id = $1',
            [profileID]
        );
        expect(actual.rows).toEqual([
            {
                dashboard_id: expect.any(Number),
                profile_id: profileID
            }
        ]);
    });

    it('parse dashboard', async () => {
        const profileID = await getProfileID();
        await client.query(
            'INSERT INTO DASHBOARD(profile_id) VALUES($1)',
            [profileID]
        );
        const actual = await parser.parseDashboard(profileID);
        expect(actual).toEqual([
            {
                dashboard_id: expect.any(Number),
                profile_id: profileID
            }
        ]);
    });

    it('delete dashboard', async () => {
        const profileID = await getProfileID();
        await client.query(
            'INSERT INTO DASHBOARD(profile_id) VALUES($1)',
            [profileID]
        );
        const dashboardID = await getDashboardID(profileID);
        await parser.deleteDashboard(dashboardID);
        const actual = await client.query(
            'SELECT * FROM DASHBOARD WHERE dashboard_id = $1',
            [dashboardID]
        );
        expect(actual.rows).toEqual([]);
    });

    async function getProfileID() {
        const query = {
            text: "SELECT profile_id FROM PROFILE WHERE email = $1",
            values: [TEST_DATA.email]
        };
        const result = await client.query(query);
        return result.rows[0].profile_id;
    }

    async function getDashboardID(profileID : number) {
        const query = {
            text: "SELECT dashboard_id FROM DASHBOARD WHERE profile_id = $1",
            values: [profileID]
        };
        const result = await client.query(query);
        return result.rows[0].dashboard_id;
    }
});
