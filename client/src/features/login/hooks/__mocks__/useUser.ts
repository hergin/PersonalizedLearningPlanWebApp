export const mockUser = {id: 1, accessToken: "access token", refreshToken: "refresh token"};
export const mockAddUser = jest.fn();
export const mockReplaceToken = jest.fn();
export const mockRemoveUser = jest.fn();

export const useUser = () => ({
    user: mockUser,
    addUser: mockAddUser,
    replaceToken: mockReplaceToken,
    removeUser: mockRemoveUser
});
