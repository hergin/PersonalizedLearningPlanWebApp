export const mockGetDashboard = jest.fn();
export const mockCreateDashboard = jest.fn();
export const mockUpdateDashboard = jest.fn();
export const mockDeleteDashboard = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getDashboard: mockGetDashboard,
        createDashboard: mockCreateDashboard,
        updateDashboard: mockUpdateDashboard,
        deleteDashboard: mockDeleteDashboard,
    };
});

export default mock;
