import * as SettingsProcessor from "../../../controller/processors/settingsProcessor";
import SettingsApi from "../../../controller/api/settingsApi";
import { createMockRequest, MOCK_RESPONSE, TEST_SETTINGS } from "./universal/mockValues";
import { StatusCode } from "../../../types";
import { initializeErrorMap } from "../../../utils/errorMessages";

jest.mock("../../../controller/api/settingsApi");

const ERROR_MESSAGES = initializeErrorMap();

describe("Settings Processor unit tests", () => {
    const settingsApi : any = new SettingsApi();

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("get settings (normal case)", async () => {
        settingsApi.getSettings.mockResolvedValueOnce([TEST_SETTINGS]);
        const mRequest = createMockRequest({}, {id: TEST_SETTINGS.accountId});
        await SettingsProcessor.getSettings(mRequest, MOCK_RESPONSE);
        expect(settingsApi.getSettings).toHaveBeenCalledTimes(1);
        expect(settingsApi.getSettings).toHaveBeenCalledWith(TEST_SETTINGS.accountId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_SETTINGS]);
    });

    it("get settings (error case)", async () => {
        settingsApi.getSettings.mockResolvedValueOnce(StatusCode.CONNECTION_ERROR);
        const mRequest = createMockRequest({}, {id: TEST_SETTINGS.accountId});
        await SettingsProcessor.getSettings(mRequest, MOCK_RESPONSE);
        expect(settingsApi.getSettings).toHaveBeenCalledTimes(1);
        expect(settingsApi.getSettings).toHaveBeenCalledWith(TEST_SETTINGS.accountId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONNECTION_ERROR));
    });

    it("update settings (normal case)", async () => {
        settingsApi.updateSettings.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({receiveEmails: !TEST_SETTINGS.receiveEmails}, {id: TEST_SETTINGS.accountId});
        await SettingsProcessor.updateSettings(mRequest, MOCK_RESPONSE);
        expect(settingsApi.updateSettings).toHaveBeenCalledTimes(1);
        expect(settingsApi.updateSettings).toHaveBeenCalledWith(TEST_SETTINGS.accountId, {receiveEmails: !TEST_SETTINGS.receiveEmails});
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("update settings (error case)", async () => {
        settingsApi.updateSettings.mockResolvedValueOnce(StatusCode.UNAUTHORIZED);
        const mRequest = createMockRequest({receiveEmails: !TEST_SETTINGS.receiveEmails}, {id: TEST_SETTINGS.accountId});
        await SettingsProcessor.updateSettings(mRequest, MOCK_RESPONSE);
        expect(settingsApi.updateSettings).toHaveBeenCalledTimes(1);
        expect(settingsApi.updateSettings).toHaveBeenCalledWith(TEST_SETTINGS.accountId, {receiveEmails: !TEST_SETTINGS.receiveEmails});
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.UNAUTHORIZED);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.UNAUTHORIZED));
    });
});
