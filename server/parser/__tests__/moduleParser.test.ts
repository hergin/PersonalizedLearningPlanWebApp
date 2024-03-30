import ModuleParser from '../moduleParser';
import { Pool } from 'pg';

jest.mock("pg");

const TEST_MODULE = {
    id: 0,
    name: "School",
    description: "My school goals :3",
    completion: 0,
    accountId: 0,
    coachId: 1,
};

describe('module parser', () => {
    const parser = new ModuleParser();
    var mockQuery : jest.Mock<any, any, any>;

    beforeEach(async () => {
        mockQuery = new Pool().query as jest.Mock<any, any, any>;
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('store module (without coach)', async () => {
        mockQuery.mockResolvedValueOnce({rows: [{module_id: TEST_MODULE.id}]})
        await parser.storeModule({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
            accountId: TEST_MODULE.accountId,
        });
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "INSERT INTO Module(module_name, description, completion_percent, account_id) VALUES($1, $2, $3, $4)",
            values: [TEST_MODULE.name, TEST_MODULE.description, TEST_MODULE.completion, TEST_MODULE.accountId]
        });
    });

    it('store module (with coach)', async () => {
        mockQuery.mockResolvedValueOnce({rows: [{module_id: TEST_MODULE.id}]})
        await parser.storeModule({
            name: TEST_MODULE.name,
            description: TEST_MODULE.description, 
            completion: TEST_MODULE.completion, 
            accountId: TEST_MODULE.accountId,
            coachId: TEST_MODULE.coachId
        });
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "INSERT INTO Module(module_name, description, completion_percent, account_id, coach_id) VALUES($1, $2, $3, $4, $5)",
            values: [TEST_MODULE.name, TEST_MODULE.description, TEST_MODULE.completion, TEST_MODULE.accountId, TEST_MODULE.coachId]
        });
    });

    it('parse modules (with account id)', async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_MODULE]});
        var actual = await parser.parseModules(TEST_MODULE.accountId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM Module WHERE account_id = $1 OR coach_id = $1",
            values: [TEST_MODULE.accountId]
        });
        expect(actual).toEqual([TEST_MODULE]);
    });

    it('parse modules (with coach id)', async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_MODULE]});
        var actual = await parser.parseModules(TEST_MODULE.coachId);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM Module WHERE account_id = $1 OR coach_id = $1",
            values: [TEST_MODULE.coachId]
        });
        expect(actual).toEqual([TEST_MODULE]);
    });

    it('update module (without coach id)', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        const updatedName = "updated";
        await parser.updateModule({
            ...TEST_MODULE,
            name: updatedName,
            coachId: undefined
        });
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "UPDATE MODULE SET module_name = $1, description = $2, completion_percent = $3 WHERE module_id = $4",
            values: [updatedName, TEST_MODULE.description, TEST_MODULE.completion, TEST_MODULE.id]
        });
    });

    it('update module (with coach id)', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        const updatedName = "updated";
        await parser.updateModule({
            ...TEST_MODULE,
            name: updatedName
        });
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "UPDATE MODULE SET module_name = $1, description = $2, completion_percent = $3, coach_id = $5 WHERE module_id = $4",
            values: [updatedName, TEST_MODULE.description, TEST_MODULE.completion, TEST_MODULE.id, TEST_MODULE.coachId]
        });
    });

    it('delete module', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.deleteModule(TEST_MODULE.id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "DELETE FROM Module WHERE module_id = $1",
            values: [TEST_MODULE.id]
        });
    });

    it('get module variable (name case)', async () => {
        mockQuery.mockResolvedValueOnce({rows: [{module_name: TEST_MODULE.name}]});
        const mockVariable = "module_name";
        const result = await parser.getModuleVariable(TEST_MODULE.id, mockVariable);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: `SELECT ${mockVariable} FROM MODULE WHERE module_id = $1`,
            values: [TEST_MODULE.id]
        });
        expect(result).toEqual([{module_name: TEST_MODULE.name}]);
    });

    it('get module variable (completion percent case)', async () => {
        mockQuery.mockResolvedValueOnce({rows: [{module_name: TEST_MODULE.name}]});
        const mockVariable = "completion_percent";
        const result = await parser.getModuleVariable(TEST_MODULE.id, mockVariable);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: `SELECT ${mockVariable} FROM MODULE WHERE module_id = $1`,
            values: [TEST_MODULE.id]
        });
        expect(result).toEqual([{module_name: TEST_MODULE.name}]);
    });

    it('module maintenance', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.runMaintenanceProcedures();
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith("CALL update_module_completion()");
    });
});
