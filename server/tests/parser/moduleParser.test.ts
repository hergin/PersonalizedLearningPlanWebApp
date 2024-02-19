export { };

import ModuleParser from '../../parser/moduleParser';

const TEST_DATA = {
    email: "testdummy@yahoo.com",
    password: "01010101010",
    refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa",
    moduleName: "School",
    moduleDescription: "My school goals :3",
    completion: 0,
    coach_id: null,
}
const TEST_DATA2 = {
    email: "test@yahoo.com",
    password: "01010101012",
    refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa",
    moduleName: "Schools",
    moduleDescription: "My school goals",
    completion: 1,
    coach_id: "testCoach@gmail.com",
}

const CREATE_ACCOUNT_QUERY = {
    text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
    values: [TEST_DATA.email, TEST_DATA.password]
}
const CREATE_ACCOUNT2_QUERY = {
    text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
    values: [TEST_DATA2.email, TEST_DATA2.password]
}

const CREATE_MODULE_QUERY = {
    text: "INSERT INTO MODULE(module_name, description, completion_percent, email) VALUES($1, $2, $3, $4)",
    values: [TEST_DATA.moduleName, TEST_DATA.moduleDescription, TEST_DATA.completion, TEST_DATA.email]
}
const CREATE_MODULE2_QUERY = {
    text: "INSERT INTO MODULE(module_name, description, completion_percent, email, coach_id) VALUES($1, $2, $3, $4, $5)",
    values: [TEST_DATA2.moduleName, TEST_DATA2.moduleDescription, TEST_DATA2.completion, TEST_DATA2.email, TEST_DATA2.coach_id]
}

describe('module parser', () => {
    const parser = new ModuleParser();
    var client: any;

    beforeEach(async () => {
        client = await parser.pool.connect();
        await client.query(CREATE_ACCOUNT_QUERY);
        await client.query(CREATE_ACCOUNT2_QUERY);
    });

    afterEach(async () => {
        await client.query(
            "DELETE FROM ACCOUNT WHERE email = $1 AND account_password = $2",
            [TEST_DATA.email, TEST_DATA.password]
        );
        await client.query(
            "DELETE FROM ACCOUNT WHERE email = $1 AND account_password = $2",
            [TEST_DATA2.email, TEST_DATA2.password]
        );
        await client.query("DELETE FROM GOAL");
        client.release();
    });

    afterAll(async () => {
        await parser.pool.end();
    });

    it('store module', async () => {
        const result = await parser.storeModule(TEST_DATA.moduleName, TEST_DATA.moduleDescription, TEST_DATA.completion, TEST_DATA.email);
        expect(result).toEqual({ module_id: expect.any(Number) });
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE email = $1",
            [TEST_DATA.email]
        );
        expect(actual.rows).toEqual([
            {
                module_id: result.module_id,
                module_name: TEST_DATA.moduleName,
                description: TEST_DATA.moduleDescription,
                completion_percent: TEST_DATA.completion,
                email: TEST_DATA.email,
                coach_id: TEST_DATA.coach_id,
            }
        ]);
    });

    it('store module with coach', async () => {
        const result = await parser.storeModule(TEST_DATA2.moduleName, TEST_DATA2.moduleDescription, TEST_DATA2.completion, TEST_DATA2.email, TEST_DATA2.coach_id);
        expect(result).toEqual({ module_id: expect.any(Number) });
        var actual = await client.query(
            `SELECT * FROM MODULE WHERE email = $1`,
            [TEST_DATA2.email]
        );
        expect(actual.rows).toEqual([
            {
                module_id: result.module_id,
                module_name: TEST_DATA2.moduleName,
                description: TEST_DATA2.moduleDescription,
                completion_percent: TEST_DATA2.completion,
                email: TEST_DATA2.email,
                coach_id: TEST_DATA2.coach_id,
            }
        ]);
    });

    it('parse module', async () => {
        await client.query(CREATE_MODULE_QUERY);
        var actual = await parser.parseModules(TEST_DATA.email);
        expect(actual).toEqual([
            {
                module_id: expect.any(Number),
                module_name: TEST_DATA.moduleName,
                description: TEST_DATA.moduleDescription,
                completion_percent: TEST_DATA.completion,
                email: TEST_DATA.email,
                coach_id: TEST_DATA.coach_id,
            }
        ]);
    });

    it('parse module with coach', async () => {
        await client.query(CREATE_MODULE2_QUERY);
        var actual = await parser.parseModules(TEST_DATA2.email);
        expect(actual).toEqual([
            {
                module_id: expect.any(Number),
                module_name: TEST_DATA2.moduleName,
                description: TEST_DATA2.moduleDescription,
                completion_percent: TEST_DATA2.completion,
                email: TEST_DATA2.email,
                coach_id: TEST_DATA2.coach_id,
            }
        ]);
    });

    it('update module', async () => {
        const updatedDescription = "My name is jeff.";
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
                email: TEST_DATA.email,
                coach_id: TEST_DATA.coach_id,
            }
        ]);
    });

    it('update module with coach', async () => {
        const updatedCoach = "cats@gamil.com";
        await client.query(CREATE_MODULE2_QUERY);
        var moduleID = await getModuleID2();
        await parser.updateModule(TEST_DATA2.moduleName, TEST_DATA2.moduleDescription, TEST_DATA2.completion, TEST_DATA2.email, moduleID, updatedCoach);
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE module_id = $1",
            [moduleID]
        );
        expect(actual.rows).toEqual([
            {
                module_id: moduleID,
                module_name: TEST_DATA2.moduleName,
                description: TEST_DATA2.moduleDescription,
                completion_percent: TEST_DATA2.completion,
                email: TEST_DATA2.email,
                coach_id: updatedCoach,
            }
        ]);
    });

    it('delete module', async () => {
        await client.query(CREATE_MODULE_QUERY);
        var moduleID = await getModuleID();
        await parser.deleteModule(moduleID);
        var actual = await client.query(
            "SELECT * FROM MODULE WHERE module_id = $1",
            [moduleID]
        );
        expect(actual.rows).toEqual([]);
    });

    it('get module variable (name case)', async () => {
        await client.query(CREATE_MODULE_QUERY);
        var moduleID = await getModuleID();
        const result = await parser.getModuleVariable(moduleID, "module_name");
        console.log(`Result from get module variable name case: ${JSON.stringify(result)}`);
        expect(result).toEqual([
            {
                module_name: TEST_DATA.moduleName
            }
        ]);
    });

    it('get module variable (completion percent case)', async () => {
        await client.query(CREATE_MODULE_QUERY);
        var moduleID = await getModuleID();
        const result = await parser.getModuleVariable(moduleID, "completion_percent");
        expect(result).toEqual([
            {
                completion_percent: TEST_DATA.completion
            }
        ]);
    });

    async function getModuleID() {
        const moduleIDQuery = await client.query(
            "SELECT module_id FROM MODULE WHERE module_name = $1 AND description = $2 AND email = $3",
            [TEST_DATA.moduleName, TEST_DATA.moduleDescription, TEST_DATA.email]
        );
        return moduleIDQuery.rows[0].module_id;
    }

    async function getModuleID2() {
        const moduleIDQuery = await client.query(
            "SELECT module_id FROM MODULE WHERE module_name = $1 AND description = $2 AND email = $3",
            [TEST_DATA2.moduleName, TEST_DATA2.moduleDescription, TEST_DATA2.email]
        );
        return moduleIDQuery.rows[0].module_id;
    }
});
