export const mockLogin = jest.fn();
export const mockRegister = jest.fn();
export const mockLogout = jest.fn();

export const AuthApi = () => ({
    login: mockLogin,
    register: mockRegister,
    logout: mockLogout
});
