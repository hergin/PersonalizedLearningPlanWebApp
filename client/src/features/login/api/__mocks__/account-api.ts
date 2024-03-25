export const mockLogin = jest.fn();
export const mockRegister = jest.fn();
export const mockLogout = jest.fn();
export const mockDeleteAccount = jest.fn();

const mock = () => ({
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout,
    deleteAccount: mockDeleteAccount,
});

export default mock;
