export const mockGetAllUserData = jest.fn();
export const mockGetUserData = jest.fn();
export const mockSetAccountToCoach = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getAllUserData: mockGetAllUserData,
        getUserData: mockGetUserData,
        setAccountToCoach: mockSetAccountToCoach,
    }
});

export type mockAdminApi = {
    getAllUserData: jest.Mock<any, any, any>,
    getUserData: jest.Mock<any, any, any>,
    setAccountToCoach: jest.Mock<any, any, any>,
};

export default mock;
