export const mockGetAllUserData = jest.fn();
export const mockGetUserData = jest.fn();
export const mockSetAccountToRole = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getAllUserData: mockGetAllUserData,
        getUserData: mockGetUserData,
        setAccountToRole: mockSetAccountToRole,
    }
});

export default mock;
