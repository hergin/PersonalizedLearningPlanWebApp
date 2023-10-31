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
        await parser.storeLogin('Xx_geogre_xX', 'Geogre123@Gmail.com', '09122001');
        expect(client.query).toBeCalledTimes(1);
        expect(client.query).toBeCalledWith('INSERT INTO ACCOUNT(username, account_password, email) VALUES (Xx_geogre_xX, 09122001, Geogre123@Gmail.com)');
    });
});
