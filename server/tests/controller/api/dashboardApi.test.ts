export {};

import DashboardAPI from "../../../controller/api/dashboardApi";
import DashboardParser from "../../../parser/dashboardParser";
import { StatusCode } from "../../../types";
import { FAKE_ERRORS, TEST_DASHBOARD } from "../global/mockValues.test";
jest.mock("../../../parser/dashboardParser");

describe('Dashboard Functions', () => {
    let parser : any;
    let dashboardAPI : DashboardAPI;

    beforeEach(() => {
        parser = new DashboardParser();
        dashboardAPI = new DashboardAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('get dashboard (pass case)', async () => {
        parser.parseDashboard.mockResolvedValueOnce([
            {profile_id: TEST_DASHBOARD.profileId, dashboard_id: TEST_DASHBOARD.id}
        ]);
        expect(await dashboardAPI.getDashboard(TEST_DASHBOARD.profileId)).toEqual({
            profile_id: TEST_DASHBOARD.profileId, dashboard_id: TEST_DASHBOARD.id
        });
    });

    it('get dashboard (dashboard missing case)', async () => {
        parser.parseDashboard.mockResolvedValueOnce([]);
        expect(await dashboardAPI.getDashboard(TEST_DASHBOARD.profileId)).toEqual(StatusCode.UNAUTHORIZED);
    });

    it('get dashboard (connection lost case)', async () => {
        parser.parseDashboard.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await dashboardAPI.getDashboard(TEST_DASHBOARD.profileId)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('get dashboard (fatal error case)', async () => {
        parser.parseDashboard.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await dashboardAPI.getDashboard(TEST_DASHBOARD.profileId)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('update dashboard (pass case)', async () => {
        parser.updateDashboard.mockResolvedValueOnce();
        expect(await dashboardAPI.updateDashboard(TEST_DASHBOARD.profileId, TEST_DASHBOARD.id)).toEqual(StatusCode.OK);
    });

    it('update dashboard (duplicate case)', async () => {
        parser.updateDashboard.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await dashboardAPI.updateDashboard(TEST_DASHBOARD.profileId, TEST_DASHBOARD.id)).toEqual(StatusCode.CONFLICT);
    });

    it('update dashboard (bad data case)', async () => {
        parser.updateDashboard.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await dashboardAPI.updateDashboard(TEST_DASHBOARD.profileId, TEST_DASHBOARD.id)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('update dashboard (connection lost case)', async () => {
        parser.updateDashboard.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await dashboardAPI.updateDashboard(TEST_DASHBOARD.profileId, TEST_DASHBOARD.id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('update dashboard (fatal error case)', async () => {
        parser.updateDashboard.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await dashboardAPI.updateDashboard(TEST_DASHBOARD.profileId, TEST_DASHBOARD.id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });

    it('delete dashboard (pass case)', async () => {
        parser.deleteDashboard.mockResolvedValueOnce();
        expect(await dashboardAPI.deleteDashboard(TEST_DASHBOARD.id)).toEqual(StatusCode.OK);
    });

    it('delete dashboard (duplicate case)', async () => {
        parser.deleteDashboard.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await dashboardAPI.deleteDashboard(TEST_DASHBOARD.id)).toEqual(StatusCode.CONFLICT);
    });

    it('delete dashboard (bad data case)', async () => {
        parser.deleteDashboard.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await dashboardAPI.deleteDashboard(TEST_DASHBOARD.id)).toEqual(StatusCode.BAD_REQUEST);
    });

    it('delete dashboard (connection lost case)', async () => {
        parser.deleteDashboard.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await dashboardAPI.deleteDashboard(TEST_DASHBOARD.id)).toEqual(StatusCode.CONNECTION_ERROR);
    });

    it('delete dashboard (fatal error case)', async () => {
        parser.deleteDashboard.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await dashboardAPI.deleteDashboard(TEST_DASHBOARD.id)).toEqual(StatusCode.INTERNAL_SERVER_ERROR);
    });
});
