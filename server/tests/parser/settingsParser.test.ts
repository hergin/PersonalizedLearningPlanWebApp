export {};

import SettingsParser from "../../parser/settingsParser";

const TEST_DATA = {
    email: "testdummy@yahoo.com",
    password: "01010101010",
    refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa",
    receive_emails: true,
    allow_coach_invitations: true
}

describe('Settings Parser Unit Tests', () => {
    const parser = new SettingsParser();
    var client: any;
    var accountId: number;
    
    beforeEach(async () => {
        client = await parser.pool.connect();
        createTestAccount();
        accountId = await getAccountID();
    });

    async function createTestAccount(): Promise<void> {
        await client.query({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES ($1, $2)",
            values: [TEST_DATA.email, TEST_DATA.password]
        });
    }

    async function getAccountID(): Promise<number> {
        const queryResult = await client.query({
            text: "SELECT id FROM ACCOUNT WHERE email = $1 AND account_password = $2",
            values: [TEST_DATA.email, TEST_DATA.password]
        });
        return queryResult.rows[0].id;
    }

    afterEach(async () => {
        await client.query({
            text: "DELETE FROM ACCOUNT WHERE id = $1",
            values: [accountId]
        });
        await client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    })

    it('get account settings (normal case)', async () => {
        const id = await getAccountSettingsID();
        const results = await parser.getAccountSettings(accountId);
        expect(results).toEqual([
            {
                id: id,
                receive_emails: TEST_DATA.receive_emails,
                allow_coach_invitations: TEST_DATA.allow_coach_invitations,
                account_id: accountId
            }
        ]);
    });

    async function getAccountSettingsID(): Promise<number> {
        const query = await client.query({
            text: "SELECT id FROM ACCOUNT_SETTINGS WHERE account_id = $1",
            values: [accountId]
        });
        return query.rows[0].id;
    }

    it('update account settings (normal case)', async () => {
        const id = await getAccountSettingsID();
        console.log(`Expected ID: ${id}`);
        await parser.updateAccountSettings(accountId, {receiveEmails: !TEST_DATA.receive_emails});
        const results = await client.query({
            text: "SELECT * FROM ACCOUNT_SETTINGS WHERE account_id = $1",
            values: [accountId]
        });
        expect(results.rows).toEqual([
            {
                id: id,
                receive_emails: !TEST_DATA.receive_emails,
                allow_coach_invitations: TEST_DATA.allow_coach_invitations,
                account_id: accountId
            }
        ]);
    });
});
