export const mockParseDashboard = jest.fn();
export const mockStoreDashboard = jest.fn();
export const mockUpdateDashboard = jest.fn();
export const mockDeleteDashboard = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        parseDashboard: mockParseDashboard,
        storeDashboard: mockStoreDashboard,
        updateDashboard: mockUpdateDashboard,
        deleteDashboard: mockDeleteDashboard,
    } 
});

export default mock;
