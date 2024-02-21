export {};

import LoginParser from '../../parser/loginParser';

const TEST_DATA = {
    email: "testdummy@yahoo.com",
    password: "01010101010",
    refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa"
}

const CREATE_ACCOUNT_QUERY = {
    text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
    values: [TEST_DATA.email, TEST_DATA.password]
}

describe('login parser tests', () => {
    const parser = new LoginParser();
    var client : any;

    beforeEach(async () => {
        client = await parser.pool.connect();
    });

    async function getAccountID(): Promise<number> {
        const queryResult = await client.query({
            text: "SELECT id FROM ACCOUNT WHERE email = $1 AND account_password = $2",
            values: [TEST_DATA.email, TEST_DATA.password]
        });
        return queryResult.rows[0].id;
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
    
    it('store login', async () => {
        await parser.storeLogin(TEST_DATA.email, TEST_DATA.password);
        let query = await client.query(
            "SELECT * FROM ACCOUNT WHERE email = $1 AND account_password = $2", 
            [TEST_DATA.email, TEST_DATA.password]
        );
        expect(query.rows).toEqual([
            {
                id: expect.any(Number),
                email: TEST_DATA.email, 
                account_password: TEST_DATA.password, 
                refresh_token: null
            }
        ]);
    });

    it('retrieve login', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        let query = await parser.retrieveLogin(TEST_DATA.email);
        expect(query).toEqual([
            {
                id: expect.any(Number),
                email: TEST_DATA.email, 
                account_password: TEST_DATA.password, 
                refresh_token: null
            }
        ]);
    });

    it('store token', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        const id: number = await getAccountID();
        await parser.storeToken(id, TEST_DATA.refreshToken);
        var actual = await client.query(
            "SELECT refresh_token FROM ACCOUNT WHERE id = $1",
            [id]
        );
        expect(actual.rows[0]).toEqual({refresh_token: TEST_DATA.refreshToken});
    });

    it('parse token', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        const id: number = await getAccountID();
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
        await client.query(CREATE_ACCOUNT_QUERY);
        const id: number = await getAccountID();
        await client.query(
            "UPDATE ACCOUNT SET refresh_token = $1 WHERE email = $2",
            [TEST_DATA.refreshToken, TEST_DATA.email]
        );
        await parser.deleteToken(id);
        const actual = await client.query(
            "SELECT refresh_token FROM ACCOUNT WHERE email = $1",
            [TEST_DATA.email]
        );
        expect(actual.rows).toEqual([
            {
                'refresh_token': ''
            }
        ]);
    });

    it('delete account', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        const id: number = await getAccountID();
        await parser.deleteAccount(id);
        const actual = await client.query(
            "SELECT * FROM ACCOUNT WHERE email = $1",
            [TEST_DATA.email]
        );
        expect(actual.rows).toEqual([]);
    });
});
