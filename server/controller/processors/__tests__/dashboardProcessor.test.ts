import * as DashboardProcessor from "../dashboardProcessor";
import DashboardAPI from "../../api/dashboardApi";
import { StatusCode } from "../../../types";
import { initializeErrorMap } from "../../../utils/errorMessages";
import { createMockRequest, MOCK_RESPONSE, TEST_DASHBOARD } from "../../global/mockValues";

jest.mock("../../../controller/api/dashboardApi");

const ERROR_MESSAGES = initializeErrorMap();

describe("dashboard processor unit tests", () => {
    const dashboardApi : any = new DashboardAPI();
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get dashboard (normal case)", async () => {
        dashboardApi.getDashboard.mockResolvedValueOnce(TEST_DASHBOARD);
        const mRequest = createMockRequest({}, {id: TEST_DASHBOARD.profileId});
        await DashboardProcessor.getDashboard(mRequest, MOCK_RESPONSE);
        expect(dashboardApi.getDashboard).toHaveBeenCalledTimes(1);
        expect(dashboardApi.getDashboard).toHaveBeenCalledWith(TEST_DASHBOARD.profileId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith(TEST_DASHBOARD);
    });

    it("get dashboard (error case)", async () => {
        dashboardApi.getDashboard.mockResolvedValueOnce(StatusCode.GONE);
        const mRequest = createMockRequest({}, {id: TEST_DASHBOARD.profileId});
        await DashboardProcessor.getDashboard(mRequest, MOCK_RESPONSE);
        expect(dashboardApi.getDashboard).toHaveBeenCalledTimes(1);
        expect(dashboardApi.getDashboard).toHaveBeenCalledWith(TEST_DASHBOARD.profileId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.GONE));
    });

    it("delete dashboard (normal case)", async () => {
        dashboardApi.deleteDashboard.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({}, {id: TEST_DASHBOARD.id});
        await DashboardProcessor.deleteDashboard(mRequest, MOCK_RESPONSE);
        expect(dashboardApi.deleteDashboard).toHaveBeenCalledTimes(1);
        expect(dashboardApi.deleteDashboard).toHaveBeenCalledWith(TEST_DASHBOARD.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("delete dashboard (error case)", async () => {
        dashboardApi.deleteDashboard.mockResolvedValueOnce(StatusCode.CONNECTION_ERROR);
        const mRequest = createMockRequest({}, {id: TEST_DASHBOARD.id});
        await DashboardProcessor.deleteDashboard(mRequest, MOCK_RESPONSE);
        expect(dashboardApi.deleteDashboard).toHaveBeenCalledTimes(1);
        expect(dashboardApi.deleteDashboard).toHaveBeenCalledWith(TEST_DASHBOARD.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONNECTION_ERROR);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONNECTION_ERROR));
    });
})
