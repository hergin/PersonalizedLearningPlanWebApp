export const mockGetSettings = jest.fn();
export const mockUpdateSettings = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getSettings: mockGetSettings,
        updateSettings: mockUpdateSettings
    }
});

export default mock;
