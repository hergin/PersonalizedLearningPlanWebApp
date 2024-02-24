export {};

import SettingsApi from "../../../controller/api/settingsApi";
import SettingsParser from "../../../parser/settingsParser";
import { StatusCode } from "../../../types";
import { FAKE_ERRORS } from "./fakeErrors";
jest.mock("../../../parser/settingsParser");

const TEST_DATA = {
    id: 1,
    receiveEmails: true,
    accountId: 1,
}

describe('Settings Processor Unit Tests', () => {
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
        parser.getAccountSettings.mockResolvedValueOnce({id: TEST_DATA.id, receive_emails: TEST_DATA.receiveEmails, account_id: TEST_DATA.accountId});
        const result = await api.getSettings(TEST_DATA.accountId);
        expect(parser.getAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.getAccountSettings).toHaveBeenCalledWith(TEST_DATA.accountId);
        expect(result).toEqual(
            {
                id: TEST_DATA.id,
                receive_emails: TEST_DATA.receiveEmails,
                account_id: TEST_DATA.accountId
            }
        );
    });

    it("get settings (bad request case)", async () => {
        parser.getAccountSettings.mockRejectedValue(FAKE_ERRORS.badRequest);
        const result = await api.getSettings(9000);
        expect(parser.getAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.getAccountSettings).toHaveBeenCalledWith(9000);
        expect(result).toEqual(StatusCode.BAD_REQUEST);
    });

    it("get settings (network error case)", async () => {
        parser.getAccountSettings.mockRejectedValue(FAKE_ERRORS.networkError);
        const result = await api.getSettings(TEST_DATA.accountId);
        expect(parser.getAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.getAccountSettings).toHaveBeenCalledWith(TEST_DATA.accountId);
        expect(result).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it("update settings (normal resolved case)", async () => {
        parser.updateAccountSettings.mockResolvedValueOnce();
        const result = await api.updateSettings(TEST_DATA.accountId, {receiveEmails: !TEST_DATA.receiveEmails});
        expect(parser.updateAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.updateAccountSettings).toHaveBeenCalledWith(TEST_DATA.accountId, {receiveEmails: !TEST_DATA.receiveEmails});
        expect(result).toEqual(StatusCode.OK);
    });

    it("update settings (bad request case)", async () => {
        parser.updateAccountSettings.mockRejectedValue(FAKE_ERRORS.badRequest);
        const result = await api.updateSettings(TEST_DATA.accountId, {receiveEmails: !TEST_DATA.receiveEmails});
        expect(parser.updateAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.updateAccountSettings).toHaveBeenCalledWith(TEST_DATA.accountId, {receiveEmails: !TEST_DATA.receiveEmails});
        expect(result).toEqual(StatusCode.BAD_REQUEST);
    });

    it("update settings (network error case)", async () => {
        parser.updateAccountSettings.mockRejectedValue(FAKE_ERRORS.networkError);
        const result = await api.updateSettings(TEST_DATA.accountId, {receiveEmails: !TEST_DATA.receiveEmails});
        expect(parser.updateAccountSettings).toHaveBeenCalledTimes(1);
        expect(parser.updateAccountSettings).toHaveBeenCalledWith(TEST_DATA.accountId, {receiveEmails: !TEST_DATA.receiveEmails});
        expect(result).toEqual(StatusCode.CONNECTION_ERROR);
    });
});
