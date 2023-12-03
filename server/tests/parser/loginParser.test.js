const LoginParser = require('../../parser/loginParser');

const TEST_DATA = {
    email: "testdummy@yahoo.com",
    username: "test_dummy",
    password: "01010101010",
    refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa"
}

const CREATE_ACCOUNT_QUERY = {
    text: "INSERT INTO ACCOUNT(username, email, account_password) VALUES($1, $2, $3)",
    values: [TEST_DATA.username, TEST_DATA.email, TEST_DATA.password]
}

describe('login parser tests', () => {
    const parser = new LoginParser();
    var client;

    beforeEach(async () => {
        client = await parser.pool.connect();
    });

    afterEach(async () => {
        await client.query(
            "DELETE FROM ACCOUNT WHERE username = $1 AND email = $2 AND account_password = $3",
            [TEST_DATA.username, TEST_DATA.email, TEST_DATA.password]
        );
        client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });
    
    it('store login', async () => {
        await parser.storeLogin(TEST_DATA.username, TEST_DATA.email, TEST_DATA.password);
        let query = await client.query(
            "SELECT * FROM ACCOUNT WHERE username = $1 AND email = $2 AND account_password = $3", 
            [TEST_DATA.username, TEST_DATA.email, TEST_DATA.password]
        );
        expect(query.rows).toEqual([
            {email: TEST_DATA.email, username: TEST_DATA.username, account_password: TEST_DATA.password, refreshtoken: null}
        ]);
    });

    it('retrieve login', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        let query = await parser.retrieveLogin(TEST_DATA.email);
        expect(query).toEqual([
            {email: TEST_DATA.email, username: TEST_DATA.username, account_password: TEST_DATA.password, refreshtoken: null}
        ]);
    });

    it('store token', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await parser.storeToken(TEST_DATA.email, TEST_DATA.refreshToken);
        var actual = await client.query(
            "SELECT refreshToken FROM ACCOUNT WHERE email = $1",
            [TEST_DATA.email]
        );
        expect(actual.rows[0]).toEqual({refreshtoken: TEST_DATA.refreshToken});
    });

    it('parse token', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(
            "UPDATE ACCOUNT SET refreshToken = $1 WHERE email = $2",
            [TEST_DATA.refreshToken, TEST_DATA.email]
        );
        expect(await parser.parseToken(TEST_DATA.email)).toEqual([
            {
                "refreshtoken": TEST_DATA.refreshToken
            }
        ]);
    });
});
