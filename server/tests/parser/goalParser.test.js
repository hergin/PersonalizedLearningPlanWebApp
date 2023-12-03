const GoalParser = require('../../parser/goalParser');

const TEST_DATA = {
    email: "testdummy@yahoo.com",
    username: "test_dummy",
    password: "01010101010",
    moduleName: "School",
    moduleDescription: "My school goals :3",
    completion: 0,
    goalName: "Complete this quiz",
    goalDescription: "This is a quiz that I need to complete.",
    isComplete: false
}

const CREATE_ACCOUNT_QUERY = {
    text: "INSERT INTO ACCOUNT(username, email, account_password) VALUES($1, $2, $3)",
    values: [TEST_DATA.username, TEST_DATA.email, TEST_DATA.password]
}

const CREATE_MODULE_QUERY = {
    text: "INSERT INTO MODULE(module_name, description, completion_percent, email) VALUES($1, $2, $3, $4)",
    values: [TEST_DATA.moduleName, TEST_DATA.moduleDescription, TEST_DATA.completion, TEST_DATA.email]
}

describe('goal parser tests', () => {
    var parser = new GoalParser();
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
        expect(await parser.parseGoals(moduleID)).toEqual([
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
