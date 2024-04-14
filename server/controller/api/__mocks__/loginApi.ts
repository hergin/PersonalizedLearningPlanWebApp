export const mockVerifyLogin = jest.fn();
export const mockCreateAccount = jest.fn();
export const mockSetToken = jest.fn();
export const mockVerifyToken = jest.fn();
export const mockLogout = jest.fn();
export const mockDelete = jest.fn();
export const mockGetEmailById = jest.fn();
export const mockGetUnderstudies = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        verifyLogin: mockVerifyLogin,
        createAccount: mockCreateAccount,
        setToken: mockSetToken,
        verifyToken: mockVerifyToken,
        logout: mockLogout,
        delete: mockDelete,
        getEmailById: mockGetEmailById,
        getUnderstudies: mockGetUnderstudies,
    }
});

export default mock;
