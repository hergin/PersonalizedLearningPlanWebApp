export const mockGetAccountSettings = jest.fn();
export const mockUpdateAccountSettings = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getAccountSettings: mockGetAccountSettings,
        updateAccountSettings: mockUpdateAccountSettings
    }
});

export default mock;
