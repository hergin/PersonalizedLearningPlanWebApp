import LoginAPI from "../../controller/loginProcessor";
import DatabaseParser from "../../parser/databaseParser";

jest.mock("../../parser/DatabaseParser", () => {
    const testParser = {
        mockRetrieveLogin: jest.fn()
    };
    return { DatabaseParser : jest.fn(() => testParser) };
});

describe('Login Functions', () => {
    let loginAPI;
    let parser;

    beforeEach(() => {
        parser = new DatabaseParser();
        loginAPI = new LoginAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('get account (pass case)', async () => {
        const testData = {
            
            username: "Xx_george_xX",
            password: "09122001",
            email: "George123@Gmail.com"
        };
        parser.retrieveLogin.mockResolvedValueOnce(
            Promise.resolve([{username: testData.username, password: testData.password, email: testData.email}])
        );
        const result = await loginAPI.getAccount(testData.username, testData.password);
        expect(result).toEqual(testData.email);
    });

    it('get account (error case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce([]);
        expect(loginAPI.getAccount("GregThSimp69", "*****")).toEqual("Invalid Login!");
    });    
});
