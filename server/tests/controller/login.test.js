const LoginAPI = require("../../controller/loginProcessor");
const DatabaseParser = require("../../parser/databaseParser");
const STATUS_CODES = require("../../statusCodes");

jest.mock("../../parser/DatabaseParser", () => {
    const testParser = {
        retrieveLogin: jest.fn()
    };
    return { DatabaseParser : jest.fn(() => testParser) };
});

describe('Login Functions', () => {
    const testData = {
        username: "Xx_george_xX",
        password: "password",
        email: "George123@Gmail.com"
    };
    
    let loginAPI;
    let parser;

    beforeEach(() => {
        parser = new DatabaseParser.DatabaseParser();
        loginAPI = new LoginAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('get account (pass case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce(
            Promise.resolve([{username: testData.username, password: testData.password, email: testData.email}])
        );
        const result = await loginAPI.getAccount(testData.username, testData.password);
        expect(result).toEqual(testData.email);
    });

    it('get account (error case)', async () => {
        parser.retrieveLogin.mockResolvedValueOnce([]);
        expect(await loginAPI.getAccount(testData.username, testData.password)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });    
});
