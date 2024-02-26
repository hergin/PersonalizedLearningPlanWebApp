export { };

import { GoalType } from '../../types';
import ModuleParser from '../../parser/moduleParser';

const TEST_DATA = {
    email: ["testdummy@yahoo.com", "example@outlook.com", "testCoach@gmail.com"],
    password: "01010101010",
    moduleNames: ["School", "Relationship", "Schools"],
    moduleDescriptions: ["My school goals :3", "My relationship goals :3", "My school goals"],
    completion: 0,
    coach_id: [1, 2],
}

describe('module parser', () => {
    const parser = new ModuleParser();
    var client: any;
    var accountId: number;
    var altAccountId: number;

    beforeEach(async () => {
        client = await parser.pool.connect();
        await createTestAccount(TEST_DATA.email[0]);
        accountId = await getAccountID(TEST_DATA.email[0]);
        await createTestAccount(TEST_DATA.email[2]);
        altAccountId = await getAccountID(TEST_DATA.email[2]);
    });

    async function createTestAccount(email: string): Promise<void> {
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

    async function createTestModule(name: string, description: string, accountId: number, coach_id?: number): Promise<void> {
        await client.query({
            text: `INSERT INTO MODULE(module_name, description, completion_percent, account_id${coach_id ? `, coach_id` : ""}) VALUES($1, $2, $3, $4${coach_id ? `, $5` : ""})`,
            values: coach_id ? [name, description, TEST_DATA.completion, accountId, coach_id] : [name, description, TEST_DATA.completion, accountId]
        });
    }

    afterEach(async () => {
        await client.query({
            text: "DELETE FROM ACCOUNT WHERE email = $1 OR email = $2 OR email = $3",
            values: [TEST_DATA.email[0], TEST_DATA.email[1], TEST_DATA.email[2]]
        });
        client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });

    it('store module', async () => {
        const result = await parser.storeModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], TEST_DATA.completion, accountId);
        expect(result).toEqual({ module_id: expect.any(Number) });
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
                account_id: accountId,
                coach_id: null,
            }
        ]);
    });

    it('store module with coach', async () => {
        const result = await parser.storeModule(TEST_DATA.moduleNames[2], TEST_DATA.moduleDescriptions[2], TEST_DATA.completion, altAccountId, TEST_DATA.coach_id[0]);
        expect(result).toEqual({ module_id: expect.any(Number) });
        var actual = await client.query(
            `SELECT * FROM MODULE WHERE account_id = $1`,
            [altAccountId]
        );
        expect(actual.rows).toEqual([
            {
                module_id: result.module_id,
                module_name: TEST_DATA.moduleNames[2],
                description: TEST_DATA.moduleDescriptions[2],
                completion_percent: TEST_DATA.completion,
                account_id: altAccountId,
                coach_id: TEST_DATA.coach_id[0],
            }
        ]);
    });

    it('parse module', async () => {
        await createTestModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], accountId);
        var actual = await parser.parseModules(accountId);
        expect(actual).toEqual([
            {
                module_id: expect.any(Number),
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: TEST_DATA.completion,
                account_id: accountId,
                coach_id: null,
            }
        ]);
    });

    it('parse module with coach', async () => {
        await createTestModule(TEST_DATA.moduleNames[2], TEST_DATA.moduleDescriptions[2], altAccountId, TEST_DATA.coach_id[0]);
        var actual = await parser.parseModules(altAccountId);
        expect(actual).toEqual([
            {
                module_id: expect.any(Number),
                module_name: TEST_DATA.moduleNames[2],
                description: TEST_DATA.moduleDescriptions[2],
                completion_percent: TEST_DATA.completion,
                account_id: altAccountId,
                coach_id: TEST_DATA.coach_id[0],
            }
        ]);
    });

    it('parse module by coach', async () => {
        await createTestModule(TEST_DATA.moduleNames[2], TEST_DATA.moduleDescriptions[2], altAccountId, TEST_DATA.coach_id[0]);
        var actual = await parser.parseModules(TEST_DATA.coach_id[0]);
        expect(actual).toEqual([
            {
                module_id: expect.any(Number),
                module_name: TEST_DATA.moduleNames[2],
                description: TEST_DATA.moduleDescriptions[2],
                completion_percent: TEST_DATA.completion,
                account_id: altAccountId,
                coach_id: TEST_DATA.coach_id[0],
            }
        ]);
    });

    it('update module', async () => {
        await createTestModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], accountId);
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
                account_id: accountId,
                coach_id: null,
            }
        ]);
    });

    it('update module with coach', async () => {
        await createTestModule(TEST_DATA.moduleNames[2], TEST_DATA.moduleDescriptions[2], altAccountId);
        const moduleID = await getModuleID(TEST_DATA.moduleNames[2], TEST_DATA.moduleDescriptions[2]);
        await parser.updateModule(TEST_DATA.moduleNames[2], TEST_DATA.moduleDescriptions[2], TEST_DATA.completion, altAccountId, moduleID, TEST_DATA.coach_id[1]);
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE module_id = $1",
            [moduleID]
        );
        expect(actual.rows).toEqual([
            {
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[2],
                description: TEST_DATA.moduleDescriptions[2],
                completion_percent: TEST_DATA.completion,
                account_id: altAccountId,
                coach_id: TEST_DATA.coach_id[1],
            }
        ]);
    });

    it('delete module', async () => {
        await createTestModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], accountId);
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        await parser.deleteModule(moduleID);
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE module_id = $1",
            [moduleID]
        );
        expect(actual.rows).toEqual([]);
    });

    it('get module variable (name case)', async () => {
        await createTestModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], accountId);
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        const result = await parser.getModuleVariable(moduleID, "module_name");
        console.log(`Result from get module variable name case: ${JSON.stringify(result)}`);
        expect(result).toEqual([
            {
                module_name: TEST_DATA.moduleNames[0]
            }
        ]);
    });

    it('get module variable (completion percent case)', async () => {
        await createTestModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], accountId);
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        const result = await parser.getModuleVariable(moduleID, "completion_percent");
        expect(result).toEqual([
            {
                completion_percent: TEST_DATA.completion
            }
        ]);
    });

    it('module maintenance (no changes case)', async () => {
        await createTestModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], accountId);
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        parser.runMaintenanceProcedures();
        const result = await client.query("SELECT * FROM MODULE WHERE module_id = $1", [moduleID]);
        expect(result.rows).toEqual([
            {
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: TEST_DATA.completion,
                account_id: accountId,
                coach_id: null
            }
        ]);
    });

    it('module maintenance (goal update case)', async () => {
        await createTestModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], accountId);
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
                account_id: accountId,
                coach_id: null
            }
        ]);
    });

    it('module maintenance (3 new goals case)', async () => {
        await createTestModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], accountId);
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        await client.query({
            text: "INSERT INTO GOAL(goal_type, is_complete, module_id) VALUES ($1, $4, $3), ($1, $2, $3), ($1, $4, $3)",
            values: [GoalType.TASK, true, moduleID, false]
        });
        await parser.runMaintenanceProcedures();
        const results = await client.query({ text: "SELECT * FROM MODULE WHERE module_id = $1", values: [moduleID] });
        expect(results.rows).toEqual([
            {
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: 33,
                account_id: accountId,
                coach_id: null
            }
        ]);
    });

    it('module maintenance (more than 1 module, same account case)', async () => {
        await createTestModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], accountId);
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
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: 50,
                account_id: accountId,
                coach_id: null
            },
            {
                module_id: altModuleID,
                module_name: TEST_DATA.moduleNames[1],
                description: TEST_DATA.moduleDescriptions[1],
                completion_percent: 100,
                account_id: accountId,
                coach_id: null
            }
        ]);
    });

    it('module maintenance (more than 1 module, different accounts case)', async () => {
        await createTestModule(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0], accountId);
        const moduleID = await getModuleID(TEST_DATA.moduleNames[0], TEST_DATA.moduleDescriptions[0]);
        await client.query({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES ($1, $2)",
            values: [TEST_DATA.email[1], TEST_DATA.password]
        });
        const altAccountID = await getAccountID(TEST_DATA.email[1]);
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
                module_id: moduleID,
                module_name: TEST_DATA.moduleNames[0],
                description: TEST_DATA.moduleDescriptions[0],
                completion_percent: 100,
                account_id: accountId,
                coach_id: null
            },
            {
                module_id: altModuleID,
                module_name: TEST_DATA.moduleNames[1],
                description: TEST_DATA.moduleDescriptions[1],
                completion_percent: 0,
                account_id: altAccountID,
                coach_id: null
            }
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
