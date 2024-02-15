export {};

import { GoalType } from '../../types';
import ModuleParser from '../../parser/moduleParser';

const TEST_DATA = {
    emails: ["testdummy@yahoo.com", "example@outlook.com"],
    password: "01010101010",
    moduleNames: ["School", "Relationship"],
    moduleDescriptions: ["My school goals :3", "My relationship goals :3"],
    completion: 0,
}

describe('module parser',() => {
    const parser = new ModuleParser();
    var client : any;
    var accountId : number;

    beforeEach(async () => {
        client = await parser.pool.connect();
        await createTestAccount();
        accountId = await getAccountID(TEST_DATA.emails[0]);
    });

    async function createTestAccount(): Promise<void> {
        await client.query({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [TEST_DATA.emails[0], TEST_DATA.password]
        });
    }

    async function getAccountID(email: string): Promise<number> {
        const queryResult = await client.query({
            text: "SELECT id FROM ACCOUNT WHERE email = $1 AND account_password = $2",
            values: [email, TEST_DATA.password]
        });
        return queryResult.rows[0].id;
    }

    async function createTestModule(): Promise<void> {
        await client.query({
            text: "INSERT INTO MODULE(module_name, description, completion_percent, account_id) VALUES($1, $2, $3, $4)",
            values: [TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], TEST_DATA.completion, accountId]
        });
    }

    afterEach(async () => {
        await client.query(
            "DELETE FROM ACCOUNT WHERE (email = $1 OR email = $3) AND account_password = $2",
            [TEST_DATA.emails[0], TEST_DATA.password, TEST_DATA.emails[1]]
        );
        client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });

    it('store module', async () => {
        const result = await parser.storeModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], TEST_DATA.completion, accountId);
        expect(result).toEqual({module_id: expect.any(Number)});
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE account_id = $1",
            [accountId]
        );
        expect(actual.rows).toEqual([
            {
                module_id: result.module_id,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: TEST_DATA.completion,
                account_id: accountId 
            }
        ]);
    });

    it('parse module', async () => {
        await createTestModule();
        var actual = await parser.parseModules(accountId);
        expect(actual).toEqual([
            {
                module_id: expect.any(Number),
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: TEST_DATA.completion,
                account_id: accountId
            }
        ]);
    });

    it('update module', async () => {
        await createTestModule();
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        await parser.updateModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[1], TEST_DATA.completion, accountId, moduleID);
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE module_id = $1",
            [moduleID]
        );
        expect(actual.rows).toEqual([
            {
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[1],
                completion_percent: TEST_DATA.completion,
                account_id: accountId
            }
        ]);
    });

    it('delete module', async () => {
        await createTestModule();
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        await parser.deleteModule(moduleID);
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE module_id = $1",
            [moduleID]
        );
        expect(actual.rows).toEqual([]);
    });

    it('get module variable (name case)', async() => {
        await createTestModule();
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        const result = await parser.getModuleVariable(moduleID, "module_name");
        console.log(`Result from get module variable name case: ${JSON.stringify(result)}`);
        expect(result).toEqual([
            {
                module_name: TEST_DATA.moduleNames[0]
            }
        ]);
    });

    it('get module variable (completion percent case)', async() => {
        await createTestModule();
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        const result = await parser.getModuleVariable(moduleID, "completion_percent");
        expect(result).toEqual([
            {
                completion_percent: TEST_DATA.completion
            }
        ]);
    });

    it('module maintenance (no changes case)', async() => {
        await createTestModule();
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        parser.runMaintenanceProcedures();
        const result = await client.query("SELECT * FROM MODULE WHERE module_id = $1", [moduleID]);
        expect(result.rows).toEqual([
            {
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: TEST_DATA.completion,
                account_id: accountId
            }
        ]);
    });

    it('module maintenance (goal update case)', async() => {
        await createTestModule();
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        await client.query({
            text: "INSERT INTO GOAL(goal_type, is_complete, module_id) VALUES ($1, $2, $3)",
            values: [GoalType.TASK, true, moduleID]
        });
        await parser.runMaintenanceProcedures();
        const results = await client.query({
            text: "SELECT * FROM MODULE WHERE module_id = $1",
            values: [moduleID]
        });
        expect(results.rows).toEqual([
            {
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: 100,
                account_id: accountId
            }
        ]);
    });

    it('module maintenance (3 new goals case)', async () => {
        await createTestModule();
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        await client.query({
            text: "INSERT INTO GOAL(goal_type, is_complete, module_id) VALUES ($1, $4, $3), ($1, $2, $3), ($1, $4, $3)",
            values: [GoalType.TASK, true, moduleID, false]
        });
        await parser.runMaintenanceProcedures();
        const results = await client.query({text: "SELECT * FROM MODULE WHERE module_id = $1", values: [moduleID]});
        expect(results.rows).toEqual([
            {
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: 33,
                account_id: accountId
            }
        ]);
    });

    it('module maintenance (more than 1 module, same account case)', async() => {
        await createTestModule();
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        await client.query({
            text: "INSERT INTO MODULE(module_name, description, completion_percent, account_id) VALUES ($1, $2, $3, $4)",
            values: [TEST_DATA.moduleNames[1], TEST_DATA.moduleDescriptions[1], 0, accountId]
        });
        const altModuleID = await getModuleID(TEST_DATA.moduleNames[1], TEST_DATA.moduleDescriptions[1]);
        await client.query({
            text: "INSERT INTO GOAL(goal_type, is_complete, module_id) VALUES ($1, $2, $3), ($1, $4, $5), ($1, $4, $3)",
            values: [GoalType.TASK, false, moduleID, true, altModuleID]
        });
        await parser.runMaintenanceProcedures();
        const results = await client.query({
            text: "SELECT * FROM MODULE WHERE module_id = $1 OR module_id = $2", 
            values: [moduleID, altModuleID]
        });
        expect(results.rows).toEqual([
            {
                module_id: altModuleID,
                module_name: TEST_DATA.moduleNames[1],
                description: TEST_DATA.moduleDescriptions[1],
                completion_percent: 100,
                account_id: accountId
            },
            {
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: 50,
                account_id: accountId
            },
        ]);
    });

    it('module maintenance (more than 1 module, different accounts case)', async() => {
        await createTestModule();
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        await client.query({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES ($1, $2)",
            values: [TEST_DATA.emails[1], TEST_DATA.password]
        });
        const altAccountID = await getAccountID(TEST_DATA.emails[1]);
        await client.query({
            text: "INSERT INTO MODULE(module_name, description, completion_percent, account_id) VALUES ($1, $2, $3, $4)",
            values: [TEST_DATA.moduleNames[1], TEST_DATA.moduleDescriptions[1], 0, altAccountID]
        });
        const altModuleID = await getModuleID(TEST_DATA.moduleNames[1], TEST_DATA.moduleDescriptions[1]);
        await client.query({
            text: "INSERT INTO GOAL(goal_type, is_complete, module_id) VALUES ($1, $4, $3), ($1, $2, $5), ($1, $4, $3)",
            values: [GoalType.TASK, false, moduleID, true, altModuleID]
        });
        await parser.runMaintenanceProcedures();
        const results = await client.query({
            text: "SELECT * FROM MODULE WHERE module_id = $1 OR module_id = $2", 
            values: [moduleID, altModuleID]
        });
        expect(results.rows).toEqual([
            {
                module_id: altModuleID,
                module_name: TEST_DATA.moduleNames[1],
                description: TEST_DATA.moduleDescriptions[1],
                completion_percent: 0,
                account_id: altAccountID
            },
            {
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: 100,
                account_id: accountId
            },
        ]);
    });

    async function getModuleID(moduleName: string, moduleDescription: string) {
        const moduleIDQuery = await client.query(
            "SELECT module_id FROM MODULE WHERE module_name = $1 AND description = $2",
            [moduleName, moduleDescription]
        );
        return moduleIDQuery.rows[0].module_id;
    }
});
