export const mockParseDashboard = jest.fn();
export const mockUpdateDashboard = jest.fn();
export const mockDeleteDashboard = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        parseDashboard: mockParseDashboard,
        updateDashboard: mockUpdateDashboard,
        deleteDashboard: mockDeleteDashboard,
    }
});

export default mock;
