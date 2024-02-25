export {};

import GoalParser from '../../parser/goalParser';
import { Goal, GoalType } from '../../types';

const TEST_DATA = {
    email: ["testdummy@yahoo.com", "example@outlook.com"],
    password: "01010101010",
    usernames: ["testdummy", "horseEnjoyer4000"],
    firstNames: ["Jim", "Karl"],
    lastNames: ["Brown", "Jobst"],
    goalNames: ["Complete this quiz", "Homework", "sub-goal"],
    goalDescriptions: ["This is a quiz that I need to complete.", "Complete my homework today.", "This is a sub goal"],
    isComplete: false,
    dueDate: `2025-01-01T23:59:59.000Z`,
    upcomingDueDate: new Date(Date.now() + (24 * 3600)),
    pastDueDate: "1990-01-23T14:19:19.000Z",
    completionTime: `2024-01-23T14:19:19.000Z`,
    distantFutureDate: `2030-01-23T14:15:00.000Z`,
    feedback: ["Good job!", "This is feedback!"],
    tagName: ["School"],
    color: ["#0000FF"],
}

interface ExpectedParentGoalResultProps {
    goalType: GoalType, 
    goalId?: number, 
    dueDateExists?: boolean, 
    completionTimeExists?: boolean, 
    expirationExists?: boolean,
    feedbackExists?: boolean
}

interface ExpectedSubGoalResultProps {
    parentGoalId: number,
    goalType: GoalType,
    dueDateExists?: boolean, 
    completionTimeExists?: boolean, 
    expirationExists?: boolean
}

function convertToPostgresTimestamp(input: string): string {
    return input.replace('T', ' ').replace('Z', '');
}

const QUERY_VARIABLES = {
    module: "module_id",
    goal: "goal_id",
    parent: "parent_goal"
}

function selectQuery(id: number, variable: string) {
    const utcToEstConversionQuery = "AT TIME ZONE 'UTC' AT TIME ZONE 'EST'";
    const dueDateString = `due_date::timestamp ${utcToEstConversionQuery} AS due_date`;
    const completionTimeString = `completion_time::timestamp ${utcToEstConversionQuery} AS completion_time`;
    const expirationString = `expiration::timestamp ${utcToEstConversionQuery} AS expiration`;
    
    const query = {
        text: `SELECT goal_id, name, description, goal_type, is_complete, module_id, tag_id, ${dueDateString}, ${completionTimeString}, ${expirationString}, parent_goal, feedback FROM GOAL WHERE ${variable} = $1`,
        values: [id]
    };
    return query;
}

describe('goal parser tests', () => {
    var parser = new GoalParser();
    var client: any;
    var accountId: number;
    var moduleId: number;
    var tagId: number;
    
    beforeEach(async () => {
        console.log(new Date(Date.now() + (24 * 3600)).toISOString());
        client = await parser.pool.connect();
        createTestAccount(TEST_DATA.email[0]);
        accountId = await getAccountID(TEST_DATA.email[0]);
        createAccountSettings(accountId);
        createTestProfile(TEST_DATA.usernames[0], TEST_DATA.firstNames[0], TEST_DATA.lastNames[0], accountId);
        createTestModule(accountId);
        moduleId = await getModuleID(accountId);
        createTestTag(accountId, TEST_DATA.tagName[0], TEST_DATA.color[0]);
        tagId = await getTagID(accountId, TEST_DATA.tagName[0]);
    });

    async function createTestAccount(email: string) {
        await client.query({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [email, TEST_DATA.password]
        });
    }

    async function getAccountID(email: string): Promise<number> {
        const queryResult = await client.query({
            text: "SELECT id FROM ACCOUNT WHERE email = $1 AND account_password = $2",
            values: [email, TEST_DATA.password]
        });
        return queryResult.rows[0].id;
    }

    async function createAccountSettings(id: number) {
        await client.query({
            text: "INSERT INTO ACCOUNT_SETTINGS(account_id) VALUES ($1)",
            values: [id]
        });
    }

    async function createTestProfile(username: string, firstName: string, lastName: string, id: number) {
        await client.query(
            "INSERT INTO PROFILE(username, first_name, last_name, account_id) VALUES ($1, $2, $3, $4)",
            [username, firstName, lastName, id]
        );
    }

    async function createTestModule(id: number) {
        await client.query({
            text: "INSERT INTO MODULE(account_id) VALUES($1)",
            values: [id]
        });
    }

    async function getModuleID(id: number): Promise<number> {
        const moduleIDQuery = await client.query(
            "SELECT module_id FROM MODULE WHERE account_id = $1",
            [id]
        );
        return moduleIDQuery.rows[0].module_id;
    }

    async function createTestTag(id: number, name: string, color: string) {
        await client.query({
            text: "INSERT INTO TAG(tag_name, color, account_id) VALUES($1, $2, $3)",
            values: [name, color, id]
        });
    }

    async function getTagID(accountId: number, name: string): Promise<number> {
        const tagIdQuery = await client.query({
            text: "SELECT tag_id AS id FROM TAG WHERE tag_name = $1 AND account_id = $2",
            values: [name, accountId]
        });
        return tagIdQuery.rows[0].id;
    }

    afterEach(async () => {
        await client.query({
            text: "DELETE FROM ACCOUNT WHERE email = $1 OR email = $2",
            values: [TEST_DATA.email[0], TEST_DATA.email[1]]
        });
        client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });
    
    it('store goal (no due date)', async () => {
        const goalID = await parser.storeGoal({
            name: TEST_DATA.goalNames[0], description: TEST_DATA.goalDescriptions[0], goalType: GoalType.TASK, 
            isComplete: TEST_DATA.isComplete, moduleId: moduleId, tagId: tagId
        });
        expect(goalID).toEqual([
            {
                goal_id: expect.any(Number)
            }
        ]);
        var actual = await client.query(selectQuery(moduleId, QUERY_VARIABLES.module));
        expect(actual.rows).toEqual(getExpectedParentGoal({goalType: GoalType.TASK}));
    });

    function getExpectedParentGoal(resultProps: ExpectedParentGoalResultProps): any[] {
        return [
            {
                goal_id: resultProps.goalId ? resultProps.goalId : expect.any(Number),
                name: TEST_DATA.goalNames[0],
                description: TEST_DATA.goalDescriptions[0],
                goal_type: resultProps.goalType,
                is_complete: TEST_DATA.isComplete,
                due_date: resultProps.dueDateExists ? new Date(TEST_DATA.dueDate) : null,
                module_id: moduleId,
                tag_id: tagId,
                completion_time: resultProps.completionTimeExists ? new Date(TEST_DATA.completionTime) : null,
                expiration: resultProps.expirationExists ? new Date(TEST_DATA.distantFutureDate) : null,
                parent_goal: null,
                feedback: resultProps.feedbackExists ? TEST_DATA.feedback : null
            }
        ]
    }

    it('store goal (with due date)', async () => {
        const goalID = await parser.storeGoal({
            name: TEST_DATA.goalNames[0], description: TEST_DATA.goalDescriptions[0], goalType: GoalType.REPEATABLE, 
            isComplete: TEST_DATA.isComplete, moduleId: moduleId, tagId: tagId, dueDate: convertToPostgresTimestamp(TEST_DATA.dueDate)});
        expect(goalID).toEqual([
            {
                goal_id: expect.any(Number)
            }
        ]);
        var actual = await client.query(selectQuery(moduleId, QUERY_VARIABLES.module));
        expect(actual.rows).toEqual(getExpectedParentGoal({goalType: GoalType.REPEATABLE, dueDateExists: true}));
    });

    it('parse parent goals', async () => {
        const id = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
            dueDate: TEST_DATA.dueDate
        });
        const result = await parser.parseParentGoals(moduleId);
        console.log(`Parsed from goals: ${JSON.stringify(result)}`);
        const defaultExpected = getExpectedParentGoal({goalId: id, goalType: GoalType.TASK, dueDateExists: true})[0];
        expect(result).toEqual([
            {
                ...defaultExpected,
                tag_name: TEST_DATA.tagName[0],
                color: TEST_DATA.color[0],
                account_id: accountId,
            }
        ]);
    });

    async function createTestGoal(goal: Goal): Promise<number> {
        await client.query({
            text: `INSERT INTO GOAL(name, description, goal_type, is_complete, module_id, tag_id${goal.dueDate ? ", due_date" : ""}) VALUES($1, $2, $3, $4, $5, $6${goal.dueDate ? ", $7" : ""})`,
            values: goal.dueDate ? 
            [goal.name, goal.description, goal.goalType, goal.isComplete, goal.moduleId, goal.tagId, goal.dueDate] :
            [goal.name, goal.description, goal.goalType, goal.isComplete, goal.moduleId, goal.tagId]
        });
        const id = await getGoalID(goal.name, goal.description);
        return id;
    }

    async function getGoalID(name: string, description: string) {
        const goalIDQuery = await client.query(
            "SELECT goal_id FROM GOAL WHERE name = $1 AND description = $2",
            [name, description]
        );
        return goalIDQuery.rows[0].goal_id;
    }

    it('parse goal variable (module_id case)', async () => {
        var goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
        });
        var result = await parser.parseGoalVariable(goalID, "module_id");
        expect(result).toEqual([
            {
                module_id: moduleId
            }
        ]);
    });

    it('update goal (no due date)', async () => {
        var goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
        });
        await parser.updateGoal({
            id: goalID, 
            name: TEST_DATA.goalNames[1], 
            description: TEST_DATA.goalDescriptions[1], 
            goalType: GoalType.TASK, 
            isComplete: false,
            tagId: tagId
        });
        var actual = await client.query(selectQuery(goalID, QUERY_VARIABLES.goal));
        var defaultExpected = getExpectedParentGoal({goalType: GoalType.TASK, goalId: goalID})[0];
        expect(actual.rows).toEqual([
            {
                ...defaultExpected,
                name: TEST_DATA.goalNames[1],
                description: TEST_DATA.goalDescriptions[1],
            }
        ]);
    });

    it('update goal (with due date)', async () => {
        var goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
        });
        await parser.updateGoal({
            id: goalID, 
            name: TEST_DATA.goalNames[1], 
            description: TEST_DATA.goalDescriptions[1], 
            goalType: GoalType.TASK, 
            isComplete: false,
            tagId: tagId,
            dueDate: convertToPostgresTimestamp(TEST_DATA.dueDate)
        });
        var actual = await client.query(selectQuery(goalID, QUERY_VARIABLES.goal));
        var defaultExpected = getExpectedParentGoal({goalType: GoalType.TASK, goalId: goalID, dueDateExists: true})[0];
        expect(actual.rows).toEqual([
            {
                ...defaultExpected,
                name: TEST_DATA.goalNames[1],
                description: TEST_DATA.goalDescriptions[1],
            }
        ]);
    });

    it('update goal timestamps (no expiration)', async () => {
        var goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.REPEATABLE,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
        });
        await parser.updateGoalTimestamps(goalID, convertToPostgresTimestamp(TEST_DATA.completionTime));
        var actual = await client.query(selectQuery(goalID, QUERY_VARIABLES.goal));
        expect(actual.rows).toEqual(getExpectedParentGoal({goalId: goalID, goalType: GoalType.REPEATABLE, completionTimeExists: true}));
    });

    it('update goal timestamp (with expiration)', async () => {
        var goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
        });
        await parser.updateGoalTimestamps(goalID, 
            convertToPostgresTimestamp(TEST_DATA.completionTime), 
            convertToPostgresTimestamp(TEST_DATA.distantFutureDate));
        var actual = await client.query(selectQuery(goalID, QUERY_VARIABLES.goal));
        expect(actual.rows).toEqual(getExpectedParentGoal({
            goalId: goalID, goalType: GoalType.TASK, completionTimeExists: true, expirationExists: true}));
    });

    it('update goal feedback', async () => {
        const goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.REPEATABLE,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId
        });
        await parser.updateGoalFeedback(goalID, TEST_DATA.feedback[1]);
        var actual = await client.query(selectQuery(goalID, QUERY_VARIABLES.goal));
        var defaultExpected = getExpectedParentGoal({goalId: goalID, goalType: GoalType.REPEATABLE})[0];
        expect(actual.rows).toEqual([
            {
                ...defaultExpected,
                feedback: TEST_DATA.feedback[1]
            }
        ]);
    });

    it('delete goal', async () => {
        var goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
        });
        await parser.deleteGoal(goalID);
        var actual = await client.query(selectQuery(goalID, QUERY_VARIABLES.goal));
        expect(actual.rows).toEqual([]);
    });

    it('store sub goal (no due date)', async () => {
        var goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
        });
        var subGoalID = await parser.storeSubGoal(goalID, 
            {name: TEST_DATA.goalNames[2], description: TEST_DATA.goalDescriptions[2], goalType: GoalType.TASK, 
                isComplete: false, moduleId: moduleId, tagId: tagId});
        expect(subGoalID).toEqual([
            {
                goal_id: expect.any(Number)
            }
        ]);
        var actual = await client.query(selectQuery(goalID, QUERY_VARIABLES.parent));
        expect(actual.rows).toEqual([
            getExceptedSubGoals({parentGoalId: goalID, goalType: GoalType.TASK})[0]
        ]);
    });

    it('store sub goal (with due date)', async () => {
        var goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
            dueDate: TEST_DATA.dueDate
        });
        var subGoalID = await parser.storeSubGoal(goalID, 
            {name: TEST_DATA.goalNames[2], description: TEST_DATA.goalDescriptions[2], goalType: GoalType.TASK, 
                isComplete: false, moduleId: moduleId, tagId: tagId, dueDate: convertToPostgresTimestamp(TEST_DATA.dueDate)});
        expect(subGoalID).toEqual([
            {
                goal_id: expect.any(Number)
            }
        ]);
        var actual = await client.query(selectQuery(goalID, QUERY_VARIABLES.parent));
        expect(actual.rows).toEqual([
            getExceptedSubGoals({parentGoalId: goalID, goalType: GoalType.TASK, dueDateExists: true})[0]
        ]);
    });

    it('parse sub goals', async () => {
        var goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
        });
        createTestSubGoals(goalID);
        const result = await parser.parseSubGoals(goalID);
        const defaultExpected = getExceptedSubGoals({goalType: GoalType.REPEATABLE, parentGoalId: goalID});
        expect(result).toContainEqual({
            ...defaultExpected[0],
            tag_name: TEST_DATA.tagName[0],
            color: TEST_DATA.color[0],
            account_id: accountId
        });
        expect(result).toContainEqual({
            ...defaultExpected[1],
            tag_name: TEST_DATA.tagName[0],
            color: TEST_DATA.color[0],
            account_id: accountId
        });
    });

    it('parse accounts with upcoming due dates (null due date case)', async () => {
        await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
        });
        const result = await parser.parseAccountsWithUpcomingDueDates();
        const filteredResults = result.filter(account => TEST_DATA.email.includes(account.email));
        expect(filteredResults).toEqual([]);
    });

    it('parse accounts with upcoming due dates (emails off case)', async () => {
        await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
        });
        await client.query({
            text: "UPDATE ACCOUNT_SETTINGS SET receive_emails = $1 WHERE account_id = $2",
            values: [false, accountId]
        });
        const result = await parser.parseAccountsWithUpcomingDueDates();
        const filteredResults = result.filter(account => TEST_DATA.email.includes(account.email));
        expect(filteredResults).toEqual([]);
    });

    it('parse accounts with upcoming due dates (correct case)', async () => {
        await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
            dueDate: TEST_DATA.upcomingDueDate.toISOString(),
        });
        const result = await parser.parseAccountsWithUpcomingDueDates();
        const filteredResults = result.filter(account => TEST_DATA.email.includes(account.email));
        expect(filteredResults).toEqual([
            {
                id: expect.any(Number),
                goal: TEST_DATA.goalNames[0],
                username: TEST_DATA.usernames[0],
                email: TEST_DATA.email[0],
                due_date: TEST_DATA.upcomingDueDate
            }
        ]);
    });

    it('parse accounts with upcoming due dates (is complete case)', async () => {
        await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: !TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
            dueDate: TEST_DATA.upcomingDueDate.toISOString(),
        });
        const result = await parser.parseAccountsWithUpcomingDueDates();
        const filteredResults = result.filter(account => TEST_DATA.email.includes(account.email));
        expect(filteredResults).toEqual([]);
    });

    it('parse accounts with upcoming due dates (past due case)', async () => {
        await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
            dueDate: TEST_DATA.pastDueDate
        });
        const result = await parser.parseAccountsWithUpcomingDueDates();
        const filteredResults = result.filter(account => TEST_DATA.email.includes(account.email));
        expect(filteredResults).toEqual([]);
    });

    it('parse accounts with upcoming due dates (distant future case)', async () => {
        await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId,
            dueDate: TEST_DATA.distantFutureDate
        });
        const result = await parser.parseAccountsWithUpcomingDueDates();
        const filteredResults = result.filter(account => TEST_DATA.email.includes(account.email));
        expect(filteredResults).toEqual([]);
    });

    it('parse accounts with upcoming due dates (two accounts, both true case)', async() => {
        const altAccountId = await createSecondAccount();
        createTestModule(altAccountId);
        const altModuleId = await getModuleID(altAccountId);
        await client.query(
            "INSERT INTO GOAL(name, description, goal_type, is_complete, module_id, due_date) VALUES ($1, $2, $3, $4, $5, $6), ($7, $8, $3, $4, $9, $6)",
            [TEST_DATA.goalNames[0], TEST_DATA.goalDescriptions[0], GoalType.TASK, TEST_DATA.isComplete, moduleId, TEST_DATA.upcomingDueDate, TEST_DATA.goalNames[1], TEST_DATA.goalDescriptions[1], altModuleId]
        );
        const result = await parser.parseAccountsWithUpcomingDueDates();
        const filteredResults = result.filter(account => TEST_DATA.email.includes(account.email));
        expect(filteredResults).toEqual([
            {
                id: expect.any(Number),
                goal: TEST_DATA.goalNames[0],
                username: TEST_DATA.usernames[0],
                email: TEST_DATA.email[0],
                due_date: TEST_DATA.upcomingDueDate,
            },
            {
                id: expect.any(Number),
                goal: TEST_DATA.goalNames[1],
                username: TEST_DATA.usernames[1],
                email: TEST_DATA.email[1],
                due_date: TEST_DATA.upcomingDueDate,
            }
        ]);
    });

    async function createSecondAccount() {
        createTestAccount(TEST_DATA.email[1]);
        const altAccountId = await getAccountID(TEST_DATA.email[1]);
        createAccountSettings(altAccountId);
        createTestProfile(TEST_DATA.usernames[1], TEST_DATA.firstNames[1], TEST_DATA.lastNames[1], altAccountId);
        return altAccountId;
    }

    it('parse accounts with upcoming due dates (two accounts, 1 true case)', async() => {
        const altAccountId = await createSecondAccount();
        createTestModule(altAccountId);
        const altModuleId = await getModuleID(altAccountId);
        await client.query(
            "INSERT INTO GOAL(name, description, goal_type, is_complete, module_id, due_date) VALUES ($1, $2, $3, $4, $5, $6), ($7, $8, $3, $4, $9, $6)",
            [TEST_DATA.goalNames[0], TEST_DATA.goalDescriptions[0], GoalType.TASK, TEST_DATA.isComplete, moduleId, TEST_DATA.upcomingDueDate, TEST_DATA.goalNames[1], TEST_DATA.goalDescriptions[1], altModuleId]
        );
        await client.query(
            "UPDATE ACCOUNT_SETTINGS SET receive_emails = $1 WHERE account_id = $2",
            [false, accountId]
        );
        const result = await parser.parseAccountsWithUpcomingDueDates();
        const filteredResults = result.filter(account => TEST_DATA.email.includes(account.email));
        expect(filteredResults).toEqual([
            {
                id: expect.any(Number),
                goal: TEST_DATA.goalNames[1],
                username: TEST_DATA.usernames[1],
                email: TEST_DATA.email[1],
                due_date: TEST_DATA.upcomingDueDate,
            }
        ]);
    });

    it('run maintenance procedures (expired goal case)', async () => {
        var goalID = await createTestGoal({
            name: TEST_DATA.goalNames[0], 
            description: TEST_DATA.goalDescriptions[0],
            goalType: GoalType.TASK,
            isComplete: TEST_DATA.isComplete,
            moduleId: moduleId,
            tagId: tagId
        });
        await client.query({
            text: "UPDATE GOAL SET is_complete = 'true', expiration = $1 WHERE goal_id = $2",
            values: [new Date(TEST_DATA.pastDueDate), goalID]
        });
        const test = await client.query("SELECT * FROM GOAL WHERE goal_id = $1", [goalID]);
        console.log(JSON.stringify(test.rows));
        await parser.runMaintenanceProcedures();
        const results = await client.query("SELECT * FROM GOAL WHERE goal_id = $1", [goalID]);
        expect(results.rows).toEqual([
            {
                goal_id: goalID,
                name: TEST_DATA.goalNames[0],
                description: TEST_DATA.goalDescriptions[0],
                goal_type: GoalType.TASK,
                is_complete: false,
                module_id: moduleId,
                tag_id: tagId,
                due_date: null,
                completion_time: null,
                expiration: new Date(TEST_DATA.pastDueDate),
                parent_goal: null,
                feedback: null
            }
        ]);
    });
    
    function getExceptedSubGoals(subGoalProps: ExpectedSubGoalResultProps) {
        return [
            {
                goal_id: expect.any(Number),
                name: TEST_DATA.goalNames[2],
                description: TEST_DATA.goalDescriptions[2],
                goal_type: subGoalProps.goalType,
                is_complete: TEST_DATA.isComplete,
                module_id: moduleId,
                tag_id: tagId,
                due_date: subGoalProps.dueDateExists ? new Date(TEST_DATA.dueDate) : null,
                completion_time: subGoalProps.completionTimeExists ? new Date(TEST_DATA.completionTime) : null,
                expiration: subGoalProps.expirationExists ? new Date(TEST_DATA.distantFutureDate) : null,
                parent_goal: subGoalProps.parentGoalId,
                feedback: null
            },
            {
                goal_id: expect.any(Number),
                name: TEST_DATA.goalNames[1],
                description: TEST_DATA.goalDescriptions[1],
                goal_type: subGoalProps.goalType,
                is_complete: TEST_DATA.isComplete,
                module_id: moduleId,
                tag_id: tagId,
                due_date: subGoalProps.dueDateExists ? new Date(TEST_DATA.dueDate) : null,
                completion_time: subGoalProps.completionTimeExists ? new Date(TEST_DATA.completionTime) : null,
                expiration: subGoalProps.expirationExists ? new Date(TEST_DATA.distantFutureDate) : null,
                parent_goal: subGoalProps.parentGoalId,
                feedback: null
            }
        ]
    }

    async function createTestSubGoals(goalID : number) {
        await client.query(
            "INSERT INTO GOAL(name, description, goal_type, is_complete, module_id, tag_id, parent_goal) VALUES ($3, $4, $5, $6, $1, $9, $2), ($7, $8, $5, $6, $1, $9, $2)",
            [moduleId, goalID, TEST_DATA.goalNames[2], TEST_DATA.goalDescriptions[2], GoalType.REPEATABLE, TEST_DATA.isComplete, TEST_DATA.goalNames[1], TEST_DATA.goalDescriptions[1], tagId]
        );
    }
});
