export {};

import LoginParser from '../loginParser';
import { Pool } from "pg";

jest.mock("pg");

const TEST_ACCOUNT = {
    id: 1,
    email: "testdummy@yahoo.com",
    password: "01010101010",
    refreshToken: "UTDefpAEyREXmgCkK04pL1SXK6jrB2tEc2ZyMbrFs61THq2y3bpRZOCj5RiPoZGa",
    coach_id: 2
}

describe('login parser tests', () => {
    const parser = new LoginParser();
    var mockQuery : any;

    beforeEach(async () => {
        mockQuery = new Pool().query;
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });
    
    it('store login', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.storeLogin(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "INSERT INTO ACCOUNT(email, account_password) VALUES($1, $2)",
            values: [TEST_ACCOUNT.email, TEST_ACCOUNT.password]
        });
    });

    it('retrieve login', async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_ACCOUNT]});
        let query = await parser.retrieveLogin(TEST_ACCOUNT.email);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM ACCOUNT WHERE email = $1",
            values: [TEST_ACCOUNT.email]
        })
        expect(query).toEqual([TEST_ACCOUNT]);
    });

    it('store token', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.storeToken(TEST_ACCOUNT.id, TEST_ACCOUNT.refreshToken);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "UPDATE ACCOUNT SET refresh_token = $1 WHERE id = $2",
            values: [TEST_ACCOUNT.refreshToken, TEST_ACCOUNT.id]
        });
    });

    it('parse token', async () => {
        mockQuery.mockResolvedValueOnce({rows: [{refreshToken: TEST_ACCOUNT.refreshToken}]});
        const result = await parser.parseToken(TEST_ACCOUNT.id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT refresh_token FROM ACCOUNT WHERE id = $1",
            values: [TEST_ACCOUNT.id]
        });
        expect(result).toEqual([{refreshToken: TEST_ACCOUNT.refreshToken}]);
    });

    it('delete token', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.deleteToken(TEST_ACCOUNT.id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "UPDATE ACCOUNT SET refresh_token = '' WHERE id = $1",
            values: [TEST_ACCOUNT.id]
        });
    });

    it('delete account', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.deleteAccount(TEST_ACCOUNT.id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "DELETE FROM ACCOUNT WHERE id = $1",
            values: [TEST_ACCOUNT.id]
        });
    });

    it('parse understudies', async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_ACCOUNT]});
        const actual = await parser.parseUnderstudies(TEST_ACCOUNT.coach_id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM UNDERSTUDY_DATA WHERE coach_id = $1",
            values: [TEST_ACCOUNT.coach_id]
        });
        expect(actual).toEqual([TEST_ACCOUNT]);
    });
});
