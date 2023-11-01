import { DatabaseParser } from "../../src/Parser/DatabaseParser";
import { validateLogin } from "../../src/controller/login";

jest.mock("../../src/Parser/DatabaseParser", () => {
    const testParser = {
        retrieveLogin: jest.fn()
        
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

    it('validate login', () => {
        parser.retrieveLogin.mockResolvedValueOnce({rows: [{'id': '1'}], rowCount: 1});
        expect(validateLogin('tsnicholas', '0912001')).toBe(1);
    });
});
