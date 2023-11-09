import { DatabaseParser } from "../../client/src/parser/DatabaseParser";

describe('Parser Test', () => {
    const parser = new DatabaseParser();
    var client;

    beforeEach(async () => {
        console.log("Connecting...");
        client = await parser.pool.connect();
        console.log("Connected!");
    });

    afterEach(async () => {
        client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });
    
    it('store login', async () => {
        const testData = {
            username: 'Xx_George_xX',
            email: 'George123@Gmail.com',
            password: '0123456789'
        };
        await parser.storeLogin(testData.username, testData.email, testData.password);
        let query = await client.query(
            "SELECT * FROM ACCOUNT WHERE username = $1 AND email = $2 AND account_password = $3", 
            [testData.username, testData.email, testData.password]
        );
        expect(query.rows).toEqual([
            {account_id: expect.any(Number), username: testData.username, email: testData.email, account_password: testData.password}
        ]);
        await client.query(
            "DELETE FROM ACCOUNT WHERE username = $1 AND email = $2 AND account_password = $3",
            [testData.username, testData.email, testData.password]
        );
    });

    it('retrieve login', async () => {
        const testData = {
            username: 'GregTheSimp69',
            email: 'Greg420@Gmail.com',
            password: 'ch@r!otte_cord@y'
        };
        await client.query(
            "INSERT INTO ACCOUNT(username, email, account_password) VALUES($1, $2, $3)",
            [testData.username, testData.email, testData.password]    
        );
        let query = await parser.retrieveLogin(testData.username, testData.password);
        expect(query).toEqual([
            {account_id: expect.any(Number), username: testData.username, email: testData.email, account_password: testData.password}
        ]);
        await client.query(
            "DELETE FROM ACCOUNT WHERE username = $1 AND email = $2 AND account_password = $3",
            [testData.username, testData.email, testData.password]
        );
    });
});
