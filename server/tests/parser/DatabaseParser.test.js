const DatabaseParser = require("../../parser/databaseParser");

const TEST_DATA = {
    email: "testdummy@yahoo.com",
    username: "test_dummy",
    password: "01010101010",
    refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa",
    firstName: "Test",
    lastName: "Dummy",
    jobTitle: "Testing Dummy",
    bio: "...",
    profilePicture: "",
    moduleName: "School",
    moduleDescription: "My school goals :3",
    completion: 0,
    goalName: "Complete this quiz",
    goalDescription: "This is a quiz that I need to complete.",
    isComplete: false,
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
    values: [TEST_DATA.moduleName, TEST_DATA.moduleDescription, TEST_DATA.completion, TEST_DATA.email]
}

// Note: These tests depend on the database already being set up correctly.
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
        await parser.storeModule(TEST_DATA.moduleName, TEST_DATA.moduleDescription, TEST_DATA.completion, TEST_DATA.email);
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE email = $1",
            [TEST_DATA.email]
        );
        expect(actual.rows).toEqual([
            {
                module_id: expect.any(Number),
                module_name: TEST_DATA.moduleName,
                description: TEST_DATA.moduleDescription,
                completion_percent: TEST_DATA.completion,
                email: TEST_DATA.email 
            }
        ]);
    });

    it('parse module', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_MODULE_QUERY);
        var actual = await parser.parseModules(TEST_DATA.email);
        expect(actual).toEqual([
            {
                module_id: expect.any(Number),
                module_name: TEST_DATA.moduleName,
                description: TEST_DATA.moduleDescription,
                completion_percent: TEST_DATA.completion,
                email: TEST_DATA.email
            }
        ]);
    });

    it('update module', async () => {
        const updatedDescription = "My name is jeff.";
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_MODULE_QUERY);
        var moduleID = await getModuleID();
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

    it('delete module', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_MODULE_QUERY);
        var moduleID = await getModuleID();
        await parser.deleteModule(moduleID);
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE module_id = $1",
            [moduleID]
        );
        expect(actual.rows).toEqual([]);
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

    it('store goal', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_MODULE_QUERY);
        var moduleID = await getModuleID();
        await parser.storeGoal(TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete, moduleID);
        var actual = await client.query(
            "SELECT * FROM GOAL WHERE module_id = $1",
            [moduleID]
        );
        expect(actual.rows).toEqual([
            {
                goal_id: expect.any(Number),
                name: TEST_DATA.goalName,
                description: TEST_DATA.goalDescription,
                completion_perc: TEST_DATA.isComplete,
                module_id: moduleID
            }
        ]);
    });

    it('parse goal', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_MODULE_QUERY);
        var moduleID = await getModuleID();
        await client.query(
            "INSERT INTO GOAL(name, description, completion_perc, module_id) VALUES ($1, $2, $3, $4)",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete, moduleID]
        );
        expect(await parser.parseGoal(moduleID)).toEqual([
            {
                goal_id: expect.any(Number),
                name: TEST_DATA.goalName,
                description: TEST_DATA.goalDescription,
                completion_perc: TEST_DATA.isComplete,
                module_id: moduleID
            }
        ]);
    });

    it('update goal', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_MODULE_QUERY);
        var moduleID = await getModuleID();
        await client.query(
            "INSERT INTO GOAL(name, description, completion_perc, module_id) VALUES ($1, $2, $3, $4)",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete, moduleID]
        );
        var goalID = await getGoalID();
        await parser.updateGoal("Homework", "Complete my homework today.", false, moduleID, goalID);
        var actual = await client.query(
            "SELECT * FROM GOAL WHERE goal_id = $1",
            [goalID]
        );
        expect(actual.rows).toEqual([
            {
                goal_id: goalID,
                name: "Homework",
                description: "Complete my homework today.",
                completion_perc: false,
                module_id: moduleID
            }
        ]);
    });

    it('delete goal', async () => {
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_MODULE_QUERY);
        var moduleID = await getModuleID();
        await client.query(
            "INSERT INTO GOAL(name, description, completion_perc, module_id) VALUES ($1, $2, $3, $4)",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete, moduleID]
        );
        var goalID = await getGoalID();
        await parser.deleteGoal(goalID);
        var actual = await client.query(
            "SELECT * FROM GOAL WHERE goal_id = $1",
            [goalID]
        );
        expect(actual.rows).toEqual([]);
    });

    async function getModuleID() {
        const moduleIDQuery = await client.query(
            "SELECT module_id FROM MODULE WHERE module_name = $1 AND description = $2 AND email = $3",
            [TEST_DATA.moduleName, TEST_DATA.moduleDescription, TEST_DATA.email]
        );
        return moduleIDQuery.rows[0].module_id;
    }

    async function getGoalID() {
        const goalIDQuery = await client.query(
            "SELECT goal_id FROM GOAL WHERE name = $1 AND description = $2 AND completion_perc = $3",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete]
        );
        return goalIDQuery.rows[0].goal_id;
    }
});
