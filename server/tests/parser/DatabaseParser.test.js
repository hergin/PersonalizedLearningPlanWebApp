const DatabaseParser = require("../../parser/databaseParser");

const TEST_DATA = {
    email: "testdummy@yahoo.com",
    username: "test_dummy",
    password: "01010101010",
    firstName: "Test",
    lastName: "Dummy",
    jobTitle: "Testing Dummy",
    bio: "...",
    profilePicture: "",
    moduleName: "School",
    description: "My school goals :3",
    completion: 0
};

const CREATE_ACCOUNT_QUERY = {
    text: "INSERT INTO ACCOUNT(username, email, account_password) VALUES($1, $2, $3)",
    values: [TEST_DATA.username, TEST_DATA.email, TEST_DATA.password]
}

const CREATE_PROFILE_QUERY = {
    text: "INSERT INTO PROFILE(firstName, lastName, email) VALUES($1, $2, $3)",
    values: [TEST_DATA.firstName, TEST_DATA.lastName, TEST_DATA.email]
}

const CREATE_MODULE_QUERY = {
    text: "INSERT INTO MODULE(module_name, description, completion_percent, email) VALUES($1, $2, $3, $4)",
    values: [TEST_DATA.moduleName, TEST_DATA.description, TEST_DATA.completion, TEST_DATA.email]
}

describe('Parser Test', () => {
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
            {email: TEST_DATA.email, username: TEST_DATA.username, account_password: TEST_DATA.password}
        ]);
    });

    it('retrieve login', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        let query = await parser.retrieveLogin(TEST_DATA.email);
        expect(query).toEqual([
            {email: TEST_DATA.email, username: TEST_DATA.username, account_password: TEST_DATA.password}
        ]);
    });

    it('store profile', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await parser.storeProfile(TEST_DATA.firstName, TEST_DATA.lastName, TEST_DATA.email);
        var query = await client.query(
            "SELECT * FROM PROFILE WHERE firstName = $1 AND lastName = $2 AND email = $3",
            [TEST_DATA.firstName, TEST_DATA.lastName, TEST_DATA.email]
        );
        expect(query.rows).toEqual([
            {
                profile_id: expect.any(Number), 
                firstname: TEST_DATA.firstName, 
                lastname: TEST_DATA.lastName,
                profilepicture: null,
                jobtitle: null,
                bio: null,
                email: TEST_DATA.email
            }
        ]);
    });
    
    it('parse profile', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_PROFILE_QUERY);
        var actual = await parser.parseProfile(TEST_DATA.email);
        expect(actual).toEqual([
            {
                profile_id: expect.any(Number), 
                firstname: TEST_DATA.firstName, 
                lastname: TEST_DATA.lastName,
                profilepicture: null,
                jobtitle: null,
                bio: null,
                email: TEST_DATA.email
            }
        ]);
    });

    it('update profile data', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_PROFILE_QUERY);
        await parser.updateProfileData(TEST_DATA.firstName, TEST_DATA.lastName, TEST_DATA.profilePicture, TEST_DATA.jobTitle, TEST_DATA.bio, TEST_DATA.email);
        var actual = await client.query(
            "SELECT * FROM PROFILE WHERE email = $1",
            [TEST_DATA.email]
        );
        expect(actual.rows).toEqual([
            {
                profile_id: expect.any(Number),
                firstname: TEST_DATA.firstName,
                lastname: TEST_DATA.lastName,
                profilepicture: TEST_DATA.profilePicture,
                jobtitle: TEST_DATA.jobTitle,
                bio: TEST_DATA.bio,
                email: TEST_DATA.email
            }
        ]);
    });

    it('store module', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await parser.storeModule(TEST_DATA.moduleName, TEST_DATA.description, TEST_DATA.completion, TEST_DATA.email);
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE email = $1",
            [TEST_DATA.email]
        );
        expect(actual.rows).toEqual([
            {
                module_id: expect.any(Number),
                module_name: TEST_DATA.moduleName,
                description: TEST_DATA.description,
                completion_percent: TEST_DATA.completion,
                email: TEST_DATA.email 
            }
        ]);
    });

    it('parse module', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_MODULE_QUERY);
        var actual = await parser.parseModule(TEST_DATA.email);
        expect(actual).toEqual([
            {
                module_id: expect.any(Number),
                module_name: TEST_DATA.moduleName,
                description: TEST_DATA.description,
                completion_percent: TEST_DATA.completion,
                email: TEST_DATA.email
            }
        ]);
    });

    it('update module', async () => {
        const updatedDescription = "My name is jeff.";
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_MODULE_QUERY);
        var moduleIdQuery = await client.query(
            "SELECT module_id FROM MODULE WHERE module_name = $1 AND description = $2 AND email = $3",
            [TEST_DATA.moduleName, TEST_DATA.description, TEST_DATA.email]
        );
        var moduleID = moduleIdQuery.rows[0].module_id;
        console.log(moduleIdQuery.rows[0].module_id);
        await parser.updateModule(TEST_DATA.moduleName, updatedDescription, TEST_DATA.completion, TEST_DATA.email, moduleID);
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE module_id = $1",
            [moduleID]
        );
        expect(actual.rows).toEqual([
            {
                module_id: moduleID,
                module_name: TEST_DATA.moduleName,
                description: updatedDescription,
                completion_percent: TEST_DATA.completion,
                email: TEST_DATA.email
            }
        ]);
    });
});
