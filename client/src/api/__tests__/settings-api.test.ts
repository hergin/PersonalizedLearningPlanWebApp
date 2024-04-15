import { SettingsApi } from "../settings-api";
import { defaultSettings, emptyUser } from "../../types";
import { useApiConnection } from "../../hooks/useApiConnection";
import { throwServerError } from "../../utils/errorHandlers";

jest.mock("../../hooks/useApiConnection");
jest.mock("../../utils/errorHandlers");

const mockAccountId = 2;
const mockError = {response: {data: "You've been hacked!"}};

describe("Settings Api Unit Tests", () => {
    var clientHook: any;
    var mockThrowServerError: jest.Mock<any, any, any>;

    beforeEach(() => {
        clientHook = useApiConnection();
        mockThrowServerError = throwServerError as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("fetch settings (empty user case)", async () => {
        const { FetchSettings } = SettingsApi();
        const settings = await FetchSettings(emptyUser.id);
        expect(settings).toEqual([defaultSettings]);
        expect(clientHook.get).toHaveBeenCalledTimes(0);
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
    });

    it("fetch settings (normal case)", async () => {
        const { FetchSettings } = SettingsApi();
        clientHook.get.mockResolvedValueOnce([{...defaultSettings, allowCoachInvitations: false}]);
        const settings = await FetchSettings(mockAccountId);
        expect(clientHook.get).toHaveBeenCalledTimes(1);
        expect(clientHook.get).toHaveBeenCalledWith(`/settings/get/${mockAccountId}`);
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
        expect(settings).toEqual([{allowCoachInvitations: false, receiveEmails: true}]);
    });

    it("fetch settings (error case)", async () => {
        const { FetchSettings } = SettingsApi();
        clientHook.get.mockRejectedValue(mockError);
        const settings = await FetchSettings(mockAccountId);
        expect(clientHook.get).toHaveBeenCalledTimes(1);
        expect(clientHook.get).toHaveBeenCalledWith(`/settings/get/${mockAccountId}`);
        expect(mockThrowServerError).toHaveBeenCalledTimes(1);
        expect(mockThrowServerError).toHaveBeenCalledWith(mockError);
        expect(settings).toEqual([defaultSettings]);
    });

    it("mutate settings (empty user case)", async () => {
        const { MutateSettings } = SettingsApi();
        await MutateSettings(emptyUser.id, {...defaultSettings, receiveEmails: false});
        expect(clientHook.put).toHaveBeenCalledTimes(0);
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
    });

    it("mutate settings (normal case)", async () => {
        clientHook.put.mockResolvedValueOnce();
        const { MutateSettings } = SettingsApi();
        await MutateSettings(mockAccountId, {...defaultSettings, receiveEmails: false});
        expect(clientHook.put).toHaveBeenCalledTimes(1);
        expect(clientHook.put).toHaveBeenCalledWith(`/settings/update/${mockAccountId}`, 
            {...defaultSettings, receiveEmails: false});
        expect(mockThrowServerError).toHaveBeenCalledTimes(0);
    });

    it("mutate settings (error case)", async () => {
        clientHook.put.mockRejectedValue(mockError);
        const { MutateSettings } = SettingsApi();
        await MutateSettings(mockAccountId, {...defaultSettings, receiveEmails: false});
        expect(clientHook.put).toHaveBeenCalledTimes(1);
        expect(clientHook.put).toHaveBeenCalledWith(`/settings/update/${mockAccountId}`, 
            {...defaultSettings, receiveEmails: false});
        expect(mockThrowServerError).toHaveBeenCalledTimes(1);
        expect(mockThrowServerError).toHaveBeenCalledWith(mockError);
    });
});
