const DatabaseParser = require("../../parser/databaseParser");

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
            {email: testData.email, username: testData.username, account_password: testData.password}
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
            {email: testData.email, username: testData.username, account_password: testData.password}
        ]);
        await client.query(
            "DELETE FROM ACCOUNT WHERE username = $1 AND email = $2 AND account_password = $3",
            [testData.username, testData.email, testData.password]
        );
    });

    it('create profile', async () => {
        const testData = {
            email: "example@Gmail.com",
            firstName: "Bob",
            lastName: "Jones"
        };
        await client.query(
            "INSERT INTO ACCOUNT(email, username, account_password) VALUES($1, $2, $3)",
            [testData.email, "example", "12345"]
        );
        await parser.createProfile(testData.firstName, testData.lastName, testData.email);
        var query = await client.query(
            "SELECT * FROM PROFILE WHERE firstName = $1 AND lastName = $2 AND email = $3",
            [testData.firstName, testData.lastName, testData.email]
        );
        expect(query.rows).toEqual([
            {
                profile_id: expect.any(Number), 
                firstname: testData.firstName, 
                lastname: testData.lastName,
                profilepicture: null,
                jobtitle: null,
                bio: null,
                email: testData.email
            }
        ]);
        await client.query(
            "DELETE FROM ACCOUNT WHERE email = $1",
            [testData.email]
        );
    });
});
