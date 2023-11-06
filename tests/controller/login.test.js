import { DatabaseParser } from "../../src/parser/DatabaseParser";
import { getAccountID } from "../../src/controller/login";

jest.mock("../../src/parser/DatabaseParser", () => {
    const testParser = {
        retrieveLogin: jest.fn()
    };
    return { DatabaseParser: jest.fn(() => testParser)}
});

describe('Login Functions', () => {
    let parser;

    beforeEach(() => {
        parser = new DatabaseParser();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('get account id (pass case)', async () => {
        const testData = {
            account_id: "1",
            username: "Xx_george_xX",
            password: "09122001",
            email: "George123@Gmail.com"
        }
        parser.retrieveLogin.mockResolvedValueOnce(
            Promise.resolve([{account_id: testData.account_id, username: testData.username, password: testData.password, email: testData.email}])
        );
        const result = await getAccountID(testData.username, testData.password);
        expect(result).toEqual(testData.account_id);
    });

    it('get account id (error case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce([]);
        await expect(getAccountID("GregThSimp69", "*****")).rejects.toThrow("Invalid Login.");
    });
});
