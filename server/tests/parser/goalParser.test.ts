export {};

const GoalParser = require('../../parser/goalParser');

const TEST_DATA = {
    email: "testdummy@yahoo.com",
    password: "01010101010",
    goalName: "Complete this quiz",
    goalDescription: "This is a quiz that I need to complete.",
    isComplete: false,
    completionTime: new Date("2024-01-23 14:19:19-05"),
    expiration: new Date("2030-01-23 14:15:00-05"),
    subGoalName: "sub-goal",
    subGoalDescription: "This is a sub goal",
    altGoalName: "Homework",
    altGoalDescription: "Complete my homework today."
}

describe('goal parser tests', () => {
    var parser = new GoalParser();
    var client : any;
    var moduleID : number;
    
    beforeEach(async () => {
        client = await parser.pool.connect();
        await client.query({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [TEST_DATA.email, TEST_DATA.password]
        });
        await client.query({
            text: "INSERT INTO MODULE(email) VALUES($1)",
            values: [TEST_DATA.email]
        });
        moduleID = await getModuleID();
    });

    async function getModuleID() {
        const moduleIDQuery = await client.query(
            "SELECT module_id FROM MODULE WHERE email = $1",
            [TEST_DATA.email]
        );
        return moduleIDQuery.rows[0].module_id;
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
    
    it('store goal', async () => {
        const goalID = await parser.storeGoal(TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete, moduleID);
        expect(goalID).toEqual([
            {
                goal_id: expect.any(Number)
            }
        ]);
        var actual = await client.query(
            "SELECT * FROM GOAL WHERE module_id = $1",
            [moduleID]
        );
        expect(actual.rows).toEqual([
            {
                goal_id: expect.any(Number),
                name: TEST_DATA.goalName,
                description: TEST_DATA.goalDescription,
                is_complete: TEST_DATA.isComplete,
                module_id: moduleID,
                completion_time: null,
                expiration: null,
                parent_goal: null
            }
        ]);
    });

    it('parse goals', async () => {
        await client.query(
            "INSERT INTO GOAL(name, description, is_complete, module_id) VALUES ($1, $2, $3, $4)",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete, moduleID]
        );
        expect(await parser.parseGoals(moduleID)).toEqual([
            {
                goal_id: expect.any(Number),
                name: TEST_DATA.goalName,
                description: TEST_DATA.goalDescription,
                is_complete: TEST_DATA.isComplete,
                module_id: moduleID,
                completion_time: null,
                expiration: null,
                parent_goal: null
            }
        ]);
    });

    it('get module id', async () => {
        await client.query(
            "INSERT INTO GOAL(name, description, is_complete, module_id) VALUES ($1, $2, $3, $4)",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete, moduleID]
        );
        var goalID = await getGoalID();
        var result = await parser.getModuleID(goalID);
        expect(result).toEqual([
            {
                module_id: moduleID
            }
        ]);
    });

    it('update goal', async () => {
        await client.query(
            "INSERT INTO GOAL(name, description, is_complete, module_id) VALUES ($1, $2, $3, $4)",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete, moduleID]
        );
        var goalID = await getGoalID();
        await parser.updateGoal(goalID, TEST_DATA.altGoalName, TEST_DATA.altGoalDescription, false);
        var actual = await client.query(
            "SELECT * FROM GOAL WHERE goal_id = $1",
            [goalID]
        );
        expect(actual.rows).toEqual([
            {
                goal_id: goalID,
                name: TEST_DATA.altGoalName,
                description: TEST_DATA.altGoalDescription,
                is_complete: false,
                module_id: moduleID,
                completion_time: null,
                expiration: null,
                parent_goal: null
            }
        ]);
    });

    it('update goal timestamps (no expiration)', async () => {
        await client.query(
            "INSERT INTO GOAL(name, description, is_complete, module_id) VALUES ($1, $2, $3, $4)",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, true, moduleID]
        );
        var goalID = await getGoalID();
        await parser.updateGoalTimestamps(goalID, TEST_DATA.completionTime);
        var actual = await client.query(
            "SELECT * FROM GOAL WHERE goal_id = $1",
            [goalID]
        );
        expect(actual.rows).toEqual([
            {
                goal_id: goalID,
                name: TEST_DATA.goalName,
                description: TEST_DATA.goalDescription,
                is_complete: true,
                module_id: moduleID,
                completion_time: TEST_DATA.completionTime,
                expiration: null,
                parent_goal: null
            }
        ]);
    });

    it('update goal timestamp (with expiration)', async () => {
        await client.query(
            "INSERT INTO GOAL(name, description, is_complete, module_id) VALUES ($1, $2, $3, $4)",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, true, moduleID]
        );
        var goalID = await getGoalID();
        await parser.updateGoalTimestamps(goalID, TEST_DATA.completionTime, TEST_DATA.expiration);
        var actual = await client.query(
            "SELECT * FROM GOAL WHERE goal_id = $1",
            [goalID]
        );
        expect(actual.rows).toEqual([
            {
                goal_id: goalID,
                name: TEST_DATA.goalName,
                description: TEST_DATA.goalDescription,
                is_complete: true,
                module_id: moduleID,
                completion_time: TEST_DATA.completionTime,
                expiration: TEST_DATA.expiration,
                parent_goal: null
            }
        ]);
    });

    it('delete goal', async () => {
        await client.query(
            "INSERT INTO GOAL(name, description, is_complete, module_id) VALUES ($1, $2, $3, $4)",
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

    it('store sub goal', async () => {
        await client.query(
            "INSERT INTO GOAL(name, description, is_complete, module_id) VALUES ($1, $2, $3, $4)",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete, moduleID]
        );
        var goalID = await getGoalID();
        var subGoalID = await parser.storeSubGoal(goalID, TEST_DATA.subGoalName, TEST_DATA.subGoalDescription, false, moduleID);
        expect(subGoalID).toEqual([
            {
                goal_id: expect.any(Number)
            }
        ]);
        var actual = await client.query(
            "SELECT * FROM GOAL WHERE parent_goal = $1",
            [goalID]
        );
        expect(actual.rows).toEqual([
            {
                goal_id: expect.any(Number),
                name: TEST_DATA.subGoalName,
                description: TEST_DATA.subGoalDescription,
                is_complete: false,
                module_id: moduleID,
                completion_time: null,
                expiration: null,
                parent_goal: goalID
            }
        ]);
    });

    it('parse sub goals', async () => {
        await client.query(
            "INSERT INTO GOAL(name, description, is_complete, module_id) VALUES ($1, $2, $3, $4)",
            [TEST_DATA.goalName, TEST_DATA.goalDescription, TEST_DATA.isComplete, moduleID]
        );
        var goalID = await getGoalID();
        await client.query(
            "INSERT INTO GOAL(name, description, is_complete, module_id, parent_goal) VALUES ($3, $4, $5, $1, $2), ($6, $7, $5, $1, $2)",
            [moduleID, goalID, TEST_DATA.subGoalName, TEST_DATA.subGoalDescription, TEST_DATA.isComplete, TEST_DATA.altGoalName, TEST_DATA.altGoalDescription]
        );
        const result = await parser.parseSubGoals(goalID);
        expect(result).toEqual([
            {
                goal_id: expect.any(Number),
                name: TEST_DATA.subGoalName,
                description: TEST_DATA.subGoalDescription,
                is_complete: TEST_DATA.isComplete,
                module_id: moduleID,
                completion_time: null,
                expiration: null,
                parent_goal: goalID
            },
            {
                goal_id: expect.any(Number),
                name: TEST_DATA.altGoalName,
                description: TEST_DATA.altGoalDescription,
                is_complete: TEST_DATA.isComplete,
                module_id: moduleID,
                completion_time: null,
                expiration: null,
                parent_goal: goalID
            }
        ]);
    })

    async function getGoalID() {
        const goalIDQuery = await client.query(
            "SELECT goal_id FROM GOAL WHERE name = $1 AND description = $2",
            [TEST_DATA.goalName, TEST_DATA.goalDescription]
        );
        return goalIDQuery.rows[0].goal_id;
    }
});
