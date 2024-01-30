export {};

const DashboardAPI = require("../../controller/dashboardProcessor");
const DashboardParser = require("../../parser/dashboardParser");
const STATUS_CODES = require("../../utils/statusCodes");
import { FAKE_ERRORS } from "./fakeErrors";

jest.mock("../../parser/dashboardParser", () => {
    const mockedParser = {
        parseDashboard: jest.fn(),
        storeDashboard: jest.fn(),
        updateDashboard: jest.fn(),
        deleteDashboard: jest.fn()
    }
    return jest.fn(() => mockedParser);
});

describe('Dashboard Functions', () => {
    const testData = {
        profile_id: 7,
        dashboard_id: 3,
    };

    let parser : any;
    let dashboardAPI : typeof DashboardAPI;

    beforeEach(() => {
        parser = new DashboardParser();
        dashboardAPI = new DashboardAPI();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('create dashboard (pass case)', async () => {
        parser.storeDashboard.mockResolvedValueOnce();
        expect(await dashboardAPI.createDashboard(testData.profile_id)).toEqual(STATUS_CODES.OK);
    });

    it('create dashboard (duplicate case)', async () => {
        parser.storeDashboard.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await dashboardAPI.createDashboard(testData.profile_id)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('create dashboard (bad data case)', async () => {
        parser.storeDashboard.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await dashboardAPI.createDashboard(testData.profile_id)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('create dashboard (connection lost case)', async () => {
        parser.storeDashboard.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await dashboardAPI.createDashboard(testData.profile_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('create dashboard (fatal error case)', async () => {
        parser.storeDashboard.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await dashboardAPI.createDashboard(testData.profile_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('get dashboard (pass case)', async () => {
        parser.parseDashboard.mockResolvedValueOnce([
            {profile_id: testData.profile_id, dashboard_id: testData.dashboard_id}
        ]);
        expect(await dashboardAPI.getDashboard(testData.profile_id)).toEqual({
            profile_id: testData.profile_id, dashboard_id: testData.dashboard_id
        });
    });

    it('get dashboard (dashboard missing case)', async () => {
        parser.parseDashboard.mockResolvedValueOnce([]);
        expect(await dashboardAPI.getDashboard(testData.profile_id)).toEqual(STATUS_CODES.UNAUTHORIZED);
    });

    it('get dashboard (connection lost case)', async () => {
        parser.parseDashboard.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await dashboardAPI.getDashboard(testData.profile_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('get dashboard (fatal error case)', async () => {
        parser.parseDashboard.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await dashboardAPI.getDashboard(testData.profile_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('update dashboard (pass case)', async () => {
        parser.updateDashboard.mockResolvedValueOnce();
        expect(await dashboardAPI.updateDashboard(testData.profile_id, testData.dashboard_id)).toEqual(STATUS_CODES.OK);
    });

    it('update dashboard (duplicate case)', async () => {
        parser.updateDashboard.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await dashboardAPI.updateDashboard(testData.profile_id, testData.dashboard_id)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('update dashboard (bad data case)', async () => {
        parser.updateDashboard.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await dashboardAPI.updateDashboard(testData.profile_id, testData.dashboard_id)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('update dashboard (connection lost case)', async () => {
        parser.updateDashboard.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await dashboardAPI.updateDashboard(testData.profile_id, testData.dashboard_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('update dashboard (fatal error case)', async () => {
        parser.updateDashboard.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await dashboardAPI.updateDashboard(testData.profile_id, testData.dashboard_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });

    it('delete dashboard (pass case)', async () => {
        parser.deleteDashboard.mockResolvedValueOnce();
        expect(await dashboardAPI.deleteDashboard(testData.dashboard_id)).toEqual(STATUS_CODES.OK);
    });

    it('delete dashboard (duplicate case)', async () => {
        parser.deleteDashboard.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        expect(await dashboardAPI.deleteDashboard(testData.dashboard_id)).toEqual(STATUS_CODES.CONFLICT);
    });

    it('delete dashboard (bad data case)', async () => {
        parser.deleteDashboard.mockRejectedValue(FAKE_ERRORS.badRequest);
        expect(await dashboardAPI.deleteDashboard(testData.dashboard_id)).toEqual(STATUS_CODES.BAD_REQUEST);
    });

    it('delete dashboard (connection lost case)', async () => {
        parser.deleteDashboard.mockRejectedValue(FAKE_ERRORS.networkError);
        expect(await dashboardAPI.deleteDashboard(testData.dashboard_id)).toEqual(STATUS_CODES.CONNECTION_ERROR);
    });

    it('delete dashboard (fatal error case)', async () => {
        parser.deleteDashboard.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        expect(await dashboardAPI.deleteDashboard(testData.dashboard_id)).toEqual(STATUS_CODES.INTERNAL_SERVER_ERROR);
    });
});
