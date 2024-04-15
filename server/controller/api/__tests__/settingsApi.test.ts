import SettingsApi from "../settingsApi";
import DatabaseParser from "../../../parser/databaseParser";
import { STATUS_CODE } from "../../../types";
import { FAKE_ERRORS, TEST_SETTINGS } from "../../global/mockValues";

jest.mock("../../../parser/databaseParser");

describe('Settings Api Unit Tests', () => {
    var api: SettingsApi;
    var parser: any = new DatabaseParser();

    beforeEach(() => {
        api = new SettingsApi();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get settings (normal resolved case)", async () => {
        parser.parseDatabase.mockResolvedValueOnce([TEST_SETTINGS]);
        const result = await api.getSettings(TEST_SETTINGS.accountId);
        expect(parser.parseDatabase).toHaveBeenCalledTimes(1);
        expect(parser.parseDatabase).toHaveBeenCalledWith({
            text: "SELECT * FROM ACCOUNT_SETTINGS WHERE account_id = $1",
            values: [TEST_SETTINGS.accountId]
        });
        expect(result).toEqual([TEST_SETTINGS]);
    });

    it("get settings (network error case)", async () => {
        parser.parseDatabase.mockRejectedValue(FAKE_ERRORS.networkError);
        const result = await api.getSettings(TEST_SETTINGS.accountId);
        expect(parser.parseDatabase).toHaveBeenCalledTimes(1);
        expect(parser.parseDatabase).toHaveBeenCalledWith({
            text: "SELECT * FROM ACCOUNT_SETTINGS WHERE account_id = $1",
            values: [TEST_SETTINGS.accountId]
        });
        expect(result).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it("update settings (normal resolved case)", async () => {
        parser.updateDatabase.mockResolvedValueOnce();
        const result = await api.updateSettings(TEST_SETTINGS.accountId, {...TEST_SETTINGS, receiveEmails: !TEST_SETTINGS.receiveEmails});
        expect(parser.updateDatabase).toHaveBeenCalledTimes(1);
        expect(parser.updateDatabase).toHaveBeenCalledWith({
            text: "UPDATE ACCOUNT_SETTINGS SET receive_emails = $1, allow_coach_invitations = $2 WHERE account_id = $3",
            values: [!TEST_SETTINGS.receiveEmails, TEST_SETTINGS.allowCoachInvitations, TEST_SETTINGS.accountId]
        });
        expect(result).toEqual(STATUS_CODE.OK);
    });

    it("update settings (bad request case)", async () => {
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.badRequest);
        const result = await api.updateSettings(TEST_SETTINGS.accountId, {...TEST_SETTINGS, receiveEmails: !TEST_SETTINGS.receiveEmails});
        expect(parser.updateDatabase).toHaveBeenCalledTimes(1);
        expect(parser.updateDatabase).toHaveBeenCalledWith({
            text: "UPDATE ACCOUNT_SETTINGS SET receive_emails = $1, allow_coach_invitations = $2 WHERE account_id = $3",
            values: [!TEST_SETTINGS.receiveEmails, TEST_SETTINGS.allowCoachInvitations, TEST_SETTINGS.accountId]
        });
        expect(result).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it("update settings (network error case)", async () => {
        parser.updateDatabase.mockRejectedValue(FAKE_ERRORS.networkError);
        const result = await api.updateSettings(TEST_SETTINGS.accountId, {...TEST_SETTINGS, receiveEmails: !TEST_SETTINGS.receiveEmails});
        expect(parser.updateDatabase).toHaveBeenCalledTimes(1);
        expect(parser.updateDatabase).toHaveBeenCalledWith({
            text: "UPDATE ACCOUNT_SETTINGS SET receive_emails = $1, allow_coach_invitations = $2 WHERE account_id = $3",
            values: [!TEST_SETTINGS.receiveEmails, TEST_SETTINGS.allowCoachInvitations, TEST_SETTINGS.accountId]
        });
        expect(result).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });
});
