export {};

import SettingsParser from "../settingsParser";
import { Pool } from "pg";

jest.mock("pg");

const TEST_SETTINGS = {
    id: 0,
    receive_emails: true,
    allow_coach_invitations: true,
    account_id: 1,
};

describe('Settings Parser Unit Tests', () => {
    const parser = new SettingsParser();
    var mockQuery : jest.Mock<any, any, any>;

    beforeEach(async () => {
        mockQuery = new Pool().query as jest.Mock<any, any, any>;
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('get account settings (normal case)', async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_SETTINGS]});
        const results = await parser.getAccountSettings(TEST_SETTINGS.account_id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM ACCOUNT_SETTINGS WHERE account_id = $1",
            values: [TEST_SETTINGS.account_id]
        });
        expect(results).toEqual([TEST_SETTINGS]);
    });

    it('update account settings (normal case)', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.updateAccountSettings(TEST_SETTINGS.account_id, {
            receiveEmails: !TEST_SETTINGS.receive_emails, 
            allowCoachInvitations: !TEST_SETTINGS.allow_coach_invitations
        });
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "UPDATE ACCOUNT_SETTINGS SET receive_emails = $1, allow_coach_invitations = $2 WHERE account_id = $3",
            values: [!TEST_SETTINGS.receive_emails, !TEST_SETTINGS.allow_coach_invitations, TEST_SETTINGS.account_id]
        });
    });
});
