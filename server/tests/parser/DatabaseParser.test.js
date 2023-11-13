const DatabaseParser = require("../../parser/databaseParser");

describe('Parser Test', () => {
    const testData = {
        email: "testdummy@yahoo.com",
        username: "test_dummy",
        password: "01010101010",
        firstName: "Test",
        lastName: "Dummy",
        jobTitle: "Testing Dummy",
        bio: "...",
        profilePicture: ""
    };
    const parser = new DatabaseParser();
    var client;

    beforeEach(async () => {
        console.log("Connecting...");
        client = await parser.pool.connect();
        console.log("Connected!");
    });

    afterEach(async () => {
        await client.query(
            "DELETE FROM ACCOUNT WHERE username = $1 AND email = $2 AND account_password = $3",
            [testData.username, testData.email, testData.password]
        );
        client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });
    
    it('store login', async () => {
        await parser.storeLogin(testData.username, testData.email, testData.password);
        let query = await client.query(
            "SELECT * FROM ACCOUNT WHERE username = $1 AND email = $2 AND account_password = $3", 
            [testData.username, testData.email, testData.password]
        );
        expect(query.rows).toEqual([
            {email: testData.email, username: testData.username, account_password: testData.password}
        ]);
    });

    it('retrieve login', async () => {
        await client.query(
            "INSERT INTO ACCOUNT(username, email, account_password) VALUES($1, $2, $3)",
            [testData.username, testData.email, testData.password]    
        );
        let query = await parser.retrieveLogin(testData.email);
        expect(query).toEqual([
            {email: testData.email, username: testData.username, account_password: testData.password}
        ]);
    });

    it('create profile', async () => {
        await client.query(
            "INSERT INTO ACCOUNT(email, username, account_password) VALUES($1, $2, $3)",
            [testData.email, testData.username, testData.password]
        );
        await parser.storeProfile(testData.firstName, testData.lastName, testData.email);
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
    });
    
    it('get profile', async () => {
        await client.query(
            "INSERT INTO ACCOUNT(email, username, account_password) VALUES($1, $2, $3)",
            [testData.email, testData.username, testData.password]
        );
        await client.query(
            "INSERT INTO PROFILE(firstName, lastName, email) VALUES($1, $2, $3)",
            [testData.firstName, testData.lastName, testData.email]
        );
        var actual = await parser.parseProfile(testData.email);
        expect(actual).toEqual([
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
    });

    it('insert profile', async () => {
        await client.query(
            "INSERT INTO ACCOUNT(email, username, account_password) VALUES($1, $2, $3)",
            [testData.email, testData.username, testData.password]
        );
        await client.query(
            "INSERT INTO PROFILE(firstName, lastName, email) VALUES($1, $2, $3)",
            [testData.firstName, testData.lastName, testData.email]
        );
        await parser.updateProfileData(testData.firstName, testData.lastName, testData.profilePicture, testData.jobTitle, testData.bio, testData.email);
        var actual = await client.query(
            "SELECT * FROM PROFILE WHERE email = $1",
            [testData.email]
        );
        expect(actual.rows).toEqual([
            {
                profile_id: expect.any(Number),
                firstname: testData.firstName,
                lastname: testData.lastName,
                profilepicture: testData.profilePicture,
                jobtitle: testData.jobTitle,
                bio: testData.bio,
                email: testData.email
            }
        ]);
    })
});
