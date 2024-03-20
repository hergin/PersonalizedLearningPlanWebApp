export {};

import LoginParser from '../loginParser';

const TEST_DATA = {
    email: ["testdummy@yahoo.com", "example@outlook.com", "foo@gmail.com", "chadthunder@gmail.com"],
    password: "01010101010",
    refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa",
    username: ["testdummy", "exampleAccount", "foo", "TheTrueChad"],
    firstName: ["Test", "Example", "Chuck", "Chad"],
    lastName: ["Dummy", "Account", "Johnson", "Thunder"]
}

describe('login parser tests', () => {
    const parser = new LoginParser();
    var client : any;

    beforeEach(async () => {
        client = await parser.pool.connect();
    });

    afterEach(async () => {
        await client.query(
            "DELETE FROM ACCOUNT WHERE account_password = $1",
            [TEST_DATA.password]
        );
        client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });
    
    it('store login', async () => {
        await parser.storeLogin(TEST_DATA.email[0], TEST_DATA.password);
        let query = await client.query(
            "SELECT * FROM ACCOUNT WHERE email = $1 AND account_password = $2", 
            [TEST_DATA.email[0], TEST_DATA.password]
        );
        expect(query.rows).toEqual([
            {
                id: expect.any(Number),
                email: TEST_DATA.email[0], 
                account_password: TEST_DATA.password, 
                refresh_token: null,
                coach_id: null
            }
        ]);
    });

    it('retrieve login', async () => {
        await createTestAccount(TEST_DATA.email[0]);
        let query = await parser.retrieveLogin(TEST_DATA.email[0]);
        expect(query).toEqual([
            {
                id: expect.any(Number),
                email: TEST_DATA.email[0], 
                account_password: TEST_DATA.password, 
                refresh_token: null,
                coach_id: null
            }
        ]);
    });

    async function createTestAccount(email: string) {
        await client.query({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [email, TEST_DATA.password]
        });
    }

    it('store token', async () => {
        await createTestAccount(TEST_DATA.email[0]);
        const id: number = await getAccountID(TEST_DATA.email[0]);
        await parser.storeToken(id, TEST_DATA.refreshToken);
        var actual = await client.query(
            "SELECT refresh_token FROM ACCOUNT WHERE id = $1",
            [id]
        );
        expect(actual.rows[0]).toEqual({refresh_token: TEST_DATA.refreshToken});
    });

    async function getAccountID(email: string): Promise<number> {
        const queryResult = await client.query({
            text: "SELECT id FROM ACCOUNT WHERE email = $1",
            values: [email]
        });
        return queryResult.rows[0].id;
    }

    it('parse token', async () => {
        await createTestAccount(TEST_DATA.email[0]);
        const id: number = await getAccountID(TEST_DATA.email[0]);
        await client.query(
            "UPDATE ACCOUNT SET refresh_token = $1 WHERE id = $2",
            [TEST_DATA.refreshToken, id]
        );
        expect(await parser.parseToken(id)).toEqual([
            {
                "refresh_token": TEST_DATA.refreshToken
            }
        ]);
    });

    it('delete token', async () => {
        await createTestAccount(TEST_DATA.email[0]);
        const id: number = await getAccountID(TEST_DATA.email[0]);
        await client.query(
            "UPDATE ACCOUNT SET refresh_token = $1 WHERE email = $2",
            [TEST_DATA.refreshToken, TEST_DATA.email[0]]
        );
        await parser.deleteToken(id);
        const actual = await client.query(
            "SELECT refresh_token FROM ACCOUNT WHERE email = $1",
            [TEST_DATA.email[0]]
        );
        expect(actual.rows).toEqual([
            {
                'refresh_token': ''
            }
        ]);
    });

    it('delete account', async () => {
        await createTestAccount(TEST_DATA.email[0]);
        const id: number = await getAccountID(TEST_DATA.email[0]);
        await parser.deleteAccount(id);
        const actual = await client.query(
            "SELECT * FROM ACCOUNT WHERE email = $1",
            [TEST_DATA.email]
        );
        expect(actual.rows).toEqual([]);
    });

    it('parse understudies', async () => {
        var numOfAccounts = 0;
        const accountIds: number[] = [];
        const testEmails = TEST_DATA.email;
        console.log(`Emails for testing: ${testEmails}`);
        for(const email of testEmails) {
            console.log(`Creating account with email ${email}`);
            await createTestAccount(email);
            const id = await getAccountID(email)
            accountIds.push(id);
            createTestProfile(id, numOfAccounts++);
        }
        await client.query({
            text: "UPDATE ACCOUNT SET coach_id = $1 WHERE id = $2 OR id = $3",
            values: [accountIds[0], accountIds[1], accountIds[2]]
        });
        const actual = await parser.parseUnderstudies(accountIds[0]);
        expect(actual).toEqual([
            {
                account_id: accountIds[1],
                profile_id: expect.any(Number),
                username: TEST_DATA.username[1],
                coach_id: accountIds[0]
            },
            {
                account_id: accountIds[2],
                profile_id: expect.any(Number),
                username: TEST_DATA.username[2],
                coach_id: accountIds[0]
            }
        ]);
    });

    async function createTestProfile(id: number, accountNum: number) {
        await client.query({
            text: "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES ($1, $2, $3, $4)",
            values: [TEST_DATA.username[accountNum], TEST_DATA.firstName[accountNum], TEST_DATA.lastName[accountNum], id]
        });
    }
});
