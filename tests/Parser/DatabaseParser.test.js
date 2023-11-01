import { DatabaseParser } from "../../src/Parser/DatabaseParser";
import { Client } from 'pg';

jest.mock('pg', () => {
    const testClient = {
        connect: jest.fn(),
        query: jest.fn(),
    };
    return { Client: jest.fn(() => testClient) }
});


describe('Parser Test', () => {
    let client;
    let parser;

    beforeEach(() => {
        client = new Client();
        parser = new DatabaseParser();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it('store login', async () => {
        client.query.mockResolvedValueOnce( {rows: [], rowCount: 0} );
        await parser.storeLogin('Xx_george_xX', 'George123@Gmail.com', '09122001');
        expect(client.query).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith('INSERT INTO ACCOUNT(username, account_password, email) VALUES (Xx_george_xX, 09122001, George123@Gmail.com)');
    });

    it('retrieve login', async () => {
        client.query.mockResolvedValueOnce( {rows: [], rowCount: 0} );
        await parser.retrieveLogin('Xx_george_xX', '09122001');
        expect(client.query).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith('SELECT * FROM ACCOUNT WHERE username = Xx_george_xX, account_password = 09122001');
    });
});
