import { SettingsApi } from "../settings-api";
import { defaultSettings } from "../../types";
import { useApiConnection } from "../../hooks/useApiConnection";
import { AxiosError } from "axios";
jest.mock("../../hooks/useApiConnection");

const ERROR_MESSAGE = "You've been hacked!";

describe("Settings Api Unit Tests", () => {
    var clientHook: any;
    var mockError: any;
    var mockAlert: any;

    beforeEach(() => {
        clientHook = useApiConnection();
        mockError = jest.spyOn(global.console, 'error');
        mockAlert = jest.spyOn(window, 'alert');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("fetch settings (empty user case)", async () => {
        const { FetchSettings } = SettingsApi();
        const settings = await FetchSettings(-1);
        expect(settings).toEqual([defaultSettings]);
        expect(clientHook.get).toHaveBeenCalledTimes(0);
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("fetch settings (normal case)", async () => {
        const { FetchSettings } = SettingsApi();
        clientHook.get.mockResolvedValueOnce([{...defaultSettings, allowCoachInvitations: false}]);
        const settings = await FetchSettings(2);
        expect(clientHook.get).toHaveBeenCalledTimes(1);
        expect(clientHook.get).toHaveBeenCalledWith("/settings/get/2");
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
        expect(settings).toEqual([{allowCoachInvitations: false, receiveEmails: true}]);
    });

    it("fetch settings (error case)", async () => {
        const { FetchSettings } = SettingsApi();
        clientHook.get.mockRejectedValue({response: {data: ERROR_MESSAGE}} as AxiosError);
        const settings = await FetchSettings(2);
        expect(clientHook.get).toHaveBeenCalledTimes(1);
        expect(clientHook.get).toHaveBeenCalledWith("/settings/get/2");
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith({response: {data: ERROR_MESSAGE}} as AxiosError);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(ERROR_MESSAGE);
    });

    it("mutate settings (empty user case)", async () => {
        const { MutateSettings } = SettingsApi();
        await MutateSettings(-1, {...defaultSettings, receiveEmails: false});
        expect(clientHook.put).toHaveBeenCalledTimes(0);
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("mutate settings (normal case)", async () => {
        clientHook.put.mockResolvedValueOnce();
        const { MutateSettings } = SettingsApi();
        await MutateSettings(2, {...defaultSettings, receiveEmails: false});
        expect(clientHook.put).toHaveBeenCalledTimes(1);
        expect(clientHook.put).toHaveBeenCalledWith("/settings/update/2", {...defaultSettings, receiveEmails: false});
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("mutate settings (error case)", async () => {
        clientHook.put.mockRejectedValue({response: {data: ERROR_MESSAGE}} as AxiosError);
        const { MutateSettings } = SettingsApi();
        await MutateSettings(2, {...defaultSettings, receiveEmails: false});
        expect(clientHook.put).toHaveBeenCalledTimes(1);
        expect(clientHook.put).toHaveBeenCalledWith("/settings/update/2", {...defaultSettings, receiveEmails: false});
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith({response: {data: ERROR_MESSAGE}} as AxiosError);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(ERROR_MESSAGE);
    });
});
