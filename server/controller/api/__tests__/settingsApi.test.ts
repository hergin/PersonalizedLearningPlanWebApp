export {};

import SettingsApi from "../settingsApi";
import SettingsParser from "../../../parser/settingsParser";
import { STATUS_CODE } from "../../../types";
import { FAKE_ERRORS, TEST_SETTINGS } from "../../global/mockValues";
jest.mock("../../../parser/settingsParser");

describe('Settings Api Unit Tests', () => {
    var api: SettingsApi;
    var parser: any;

    beforeEach(() => {
        api = new SettingsApi();
        parser = new SettingsParser();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("get settings (normal resolved case)", async () => {
        parser.getAccountSettings.mockResolvedValueOnce({id: TEST_SETTINGS.id, receive_emails: TEST_SETTINGS.receiveEmails, account_id: TEST_SETTINGS.accountId});
        const result = await api.getSettings(TEST_SETTINGS.accountId);
        expect(parser.getAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.getAccountSettings).toHaveBeenCalledWith(TEST_SETTINGS.accountId);
        expect(result).toEqual(
            {
                id: TEST_SETTINGS.id,
                receive_emails: TEST_SETTINGS.receiveEmails,
                account_id: TEST_SETTINGS.accountId
            }
        );
    });

    it("get settings (bad request case)", async () => {
        parser.getAccountSettings.mockRejectedValue(FAKE_ERRORS.badRequest);
        const result = await api.getSettings(9000);
        expect(parser.getAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.getAccountSettings).toHaveBeenCalledWith(9000);
        expect(result).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it("get settings (network error case)", async () => {
        parser.getAccountSettings.mockRejectedValue(FAKE_ERRORS.networkError);
        const result = await api.getSettings(TEST_SETTINGS.accountId);
        expect(parser.getAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.getAccountSettings).toHaveBeenCalledWith(TEST_SETTINGS.accountId);
        expect(result).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it("update settings (normal resolved case)", async () => {
        parser.updateAccountSettings.mockResolvedValueOnce();
        const result = await api.updateSettings(TEST_SETTINGS.accountId, {receiveEmails: !TEST_SETTINGS.receiveEmails, allowCoachInvitations: TEST_SETTINGS.allowCoachInvitations});
        expect(parser.updateAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.updateAccountSettings).toHaveBeenCalledWith(TEST_SETTINGS.accountId, {receiveEmails: !TEST_SETTINGS.receiveEmails, allowCoachInvitations: TEST_SETTINGS.allowCoachInvitations});
        expect(result).toEqual(STATUS_CODE.OK);
    });

    it("update settings (bad request case)", async () => {
        parser.updateAccountSettings.mockRejectedValue(FAKE_ERRORS.badRequest);
        const result = await api.updateSettings(TEST_SETTINGS.accountId, {receiveEmails: !TEST_SETTINGS.receiveEmails, allowCoachInvitations: TEST_SETTINGS.allowCoachInvitations});
        expect(parser.updateAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.updateAccountSettings).toHaveBeenCalledWith(TEST_SETTINGS.accountId, {receiveEmails: !TEST_SETTINGS.receiveEmails, allowCoachInvitations: TEST_SETTINGS.allowCoachInvitations});
        expect(result).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it("update settings (network error case)", async () => {
        parser.updateAccountSettings.mockRejectedValue(FAKE_ERRORS.networkError);
        const result = await api.updateSettings(TEST_SETTINGS.accountId, {receiveEmails: !TEST_SETTINGS.receiveEmails, allowCoachInvitations: TEST_SETTINGS.allowCoachInvitations});
        expect(parser.updateAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.updateAccountSettings).toHaveBeenCalledWith(TEST_SETTINGS.accountId, {receiveEmails: !TEST_SETTINGS.receiveEmails, allowCoachInvitations: TEST_SETTINGS.allowCoachInvitations});
        expect(result).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });
});
