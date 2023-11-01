import { DatabaseParser } from "../../src/Parser/DatabaseParser";
import { validateLogin, createAccount } from "../../src/controller/login";

jest.mock("../../src/Parser/DatabaseParser", () => {
    const testParser = {
        retrieveLogin: jest.fn(),
        storeLogin: jest.fn()
    };
    return { DatabaseParser: jest.fn(() => testParser)};
});

describe('Validate Login', () => {
    let parser;

    beforeEach(() => {
        parser = new DatabaseParser();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('create account', () => {
        parser.storeLogin.mockResolvedValueOnce({rows: [], rowCount: 0});
        createAccount('dog', 'woof');
        expect(parser.storeLogin).toBeCalledTimes(1);
        expect(parser.storeLogin).toBeCalledWith('dog', 'woof'); 
    });

    it('validate login', () => {
        parser.retrieveLogin.mockResolvedValueOnce({rows: [{'id': '1', 'username': 'tsnicholas', 'account_password': '0912001', 'email': '1223423@Gmail.com'}], rowCount: 1});
        expect(validateLogin('tsnicholas', '0912001')).toBe('1');
    });
});
