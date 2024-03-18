import AccountApi from "../account-api";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { AxiosError } from "axios";
import { renderHook } from "@testing-library/react";

jest.mock("../../../../hooks/useApiConnection");

const TEST_UNDERSTUDY = {
    account_id: 1,
    profile_id: 1,
    username: "Xx_TestDummy_xX",
    coach_id: 2,
}
const TEST_ERROR : AxiosError = {message: "I don't feel like querying right now. :("} as AxiosError;

describe("AccountApi Unit Tests", () => {
    var apiClient: any;
    var mockError: any;
    var mockAlert: any;

    beforeEach(() => {
        apiClient = useApiConnection();
        mockError = jest.spyOn(global.console, 'error');
        mockAlert = jest.spyOn(window, 'alert');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("fetchUnderstudies (normal case)", async () => {
        const { result } = renderHook(AccountApi);
        apiClient.get.mockResolvedValueOnce([TEST_UNDERSTUDY]);
        await result.current.fetchUnderstudies(TEST_UNDERSTUDY.coach_id);
        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith(`/auth/understudy/${TEST_UNDERSTUDY.coach_id}`);
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("fetchUnderstudies (error case)", async () => {
        const { result } = renderHook(AccountApi);
        apiClient.get.mockRejectedValue(TEST_ERROR);
        await result.current.fetchUnderstudies(TEST_UNDERSTUDY.coach_id);
        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith(`/auth/understudy/${TEST_UNDERSTUDY.coach_id}`);
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith(TEST_ERROR);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(TEST_ERROR.message);
    });
});
