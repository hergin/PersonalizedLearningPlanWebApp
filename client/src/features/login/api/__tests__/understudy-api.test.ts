import UnderstudyApi from "../understudy-api";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { throwServerError } from "../../../../utils/errorHandlers";
import { renderHook } from "@testing-library/react";

jest.mock("../../../../hooks/useApiConnection");
jest.mock("../../../../utils/errorHandlers");

const TEST_UNDERSTUDY = {
    account_id: 1,
    profile_id: 1,
    username: "Xx_TestDummy_xX",
    coach_id: 2,
}
const TEST_ERROR = { message: "I don't feel like querying right now. :(" };

describe("Understudy Api Unit Tests", () => {
    var apiClient: any;
    var mockServerThrower: jest.Mock<any, any, any>;

    beforeEach(() => {
        apiClient = useApiConnection();
        mockServerThrower = throwServerError as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("fetchUnderstudies (normal case)", async () => {
        const { result } = renderHook(UnderstudyApi);
        apiClient.get.mockResolvedValueOnce([TEST_UNDERSTUDY]);
        await result.current.fetchUnderstudies(TEST_UNDERSTUDY.coach_id);
        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith(`/auth/understudy/${TEST_UNDERSTUDY.coach_id}`);
        expect(mockServerThrower).toHaveBeenCalledTimes(0);
    });

    it("fetchUnderstudies (error case)", async () => {
        const { result } = renderHook(UnderstudyApi);
        apiClient.get.mockRejectedValue(TEST_ERROR);
        await result.current.fetchUnderstudies(TEST_UNDERSTUDY.coach_id);
        expect(apiClient.get).toHaveBeenCalledTimes(1);
        expect(apiClient.get).toHaveBeenCalledWith(`/auth/understudy/${TEST_UNDERSTUDY.coach_id}`);
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(TEST_ERROR);
    });
});
