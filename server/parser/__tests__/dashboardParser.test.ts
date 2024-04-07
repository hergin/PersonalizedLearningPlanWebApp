import DashboardParser from '../dashboardParser';
import { Pool } from 'pg';

jest.mock("pg");

const TEST_DASHBOARD = {
    dashboard_id: 0,
    profile_id: 1,
};

describe('dashboard parser', () => {
    var parser = new DashboardParser();
    var mockQuery: jest.Mock<any, any, any>;

    beforeEach(async () => {
        mockQuery = new Pool().query as jest.Mock<any, any, any>;
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    it('parse dashboard', async () => {
        mockQuery.mockResolvedValueOnce({rows: [TEST_DASHBOARD]});
        const actual = await parser.parseDashboard(TEST_DASHBOARD.profile_id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "SELECT * FROM Dashboard WHERE profile_id = $1",
            values: [TEST_DASHBOARD.profile_id]
        });
        expect(actual).toEqual([TEST_DASHBOARD]);
    });

    it('delete dashboard', async () => {
        mockQuery.mockResolvedValueOnce(undefined);
        await parser.deleteDashboard(TEST_DASHBOARD.dashboard_id);
        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith({
            text: "DELETE FROM Dashboard WHERE dashboard_id = $1",
            values: [TEST_DASHBOARD.dashboard_id]
        });
    });
});
