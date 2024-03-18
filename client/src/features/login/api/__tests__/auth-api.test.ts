import { renderHook } from "@testing-library/react";
import { AuthApi } from "../auth-api";
import { LoginProps } from "../../../../types";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { useUser } from "../../hooks/useUser";
import { AxiosError } from "axios";

jest.mock("../../../../hooks/useApiConnection");
jest.mock("../../hooks/useUser");

interface T {
    firstName: string,
    lastName: string,
    username: string,
    account_id: number
}

const mockUser = {id: 1, accessToken: "access token", refreshToken: "refresh token"};
const TEST_DATA = {
    email: "example@gmail.com",
    password: "clever password",
    firstName: "Test",
    lastName: "Dummy",
    username: "Xx_TestDummy_xX",
    id: 1,
    accessToken: "access token",
    refreshToken: "refresh token",
    errorMessage: "Failed to login"
};

describe("AuthApi Unit Tests", () => {
    var apiClient: any;
    var userHook: any;
    var mockError: any;
    var mockAlert: any;

    beforeEach(() => {
        apiClient = useApiConnection();
        userHook = useUser();
        mockError = jest.spyOn(global.console, 'error');
        mockAlert = jest.spyOn(window, 'alert');
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("login (normal case)", async () => {
        const login = renderHook(AuthApi).result.current.login;
        apiClient.post.mockResolvedValueOnce({id: TEST_DATA.id, accessToken: TEST_DATA.accessToken, refreshToken: TEST_DATA.refreshToken});
        await login(TEST_DATA.email, TEST_DATA.password);
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {email: TEST_DATA.email, password: TEST_DATA.password});
        expect(userHook.addUser).toHaveBeenCalledTimes(1);
        expect(userHook.addUser).toHaveBeenCalledWith({id: TEST_DATA.id, accessToken: TEST_DATA.accessToken, refreshToken: TEST_DATA.refreshToken});
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("login (error case)", async () => {
        const login = renderHook(AuthApi).result.current.login;
        apiClient.post.mockRejectedValue({message: TEST_DATA.errorMessage} as AxiosError);
        await login(TEST_DATA.email, TEST_DATA.password);
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {email: TEST_DATA.email, password: TEST_DATA.password});
        expect(userHook.addUser).toHaveBeenCalledTimes(0);
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith({message: TEST_DATA.errorMessage} as AxiosError);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(TEST_DATA.errorMessage);
    });

    it("register (normal case)", async () => {
        const register = renderHook(AuthApi).result.current.register;
        apiClient.post.mockImplementation((path: string, data: LoginProps | T) => {
            var values;
            switch(path) {
                case "/auth/register":
                    values = data as LoginProps;
                    if(values.email === TEST_DATA.email && values.password === TEST_DATA.password) {
                        return Promise.resolve();
                    }
                    return Promise.reject({message: "Wrong values inserted for register query"});
                case "/auth/login":
                    values = data as LoginProps;
                    if(values.email === TEST_DATA.email && values.password === TEST_DATA.password) {
                        return Promise.resolve(mockUser);
                    }
                    return Promise.reject({message: "Wrong values inserted for login query."});
                case "/profile/create":
                    values = data as T;
                    if(values.firstName == TEST_DATA.firstName, values.lastName === TEST_DATA.lastName && values.username === TEST_DATA.username && values.account_id === TEST_DATA.id) {
                        return Promise.resolve();
                    }
                    return Promise.reject({message: "Wrong values inserted for create profile query."});
                default:
                    return Promise.reject({message: "Path is incorrect."});
            }
        });
        await register({
            email: TEST_DATA.email,
            password: TEST_DATA.password,
            firstName: TEST_DATA.firstName,
            lastName: TEST_DATA.lastName,
            username: TEST_DATA.username
        });
        expect(apiClient.post).toHaveBeenCalledTimes(3);
        expect(userHook.addUser).toHaveBeenCalledTimes(1);
        expect(userHook.addUser).toHaveBeenCalledWith(mockUser);
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("register (registration error case)", async () => {
        const register = renderHook(AuthApi).result.current.register;
        apiClient.post.mockRejectedValue({message: TEST_DATA.errorMessage} as AxiosError);
        await register({
            email: TEST_DATA.email,
            password: TEST_DATA.password,
            firstName: TEST_DATA.firstName,
            lastName: TEST_DATA.lastName,
            username: TEST_DATA.username
        });
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {email: TEST_DATA.email, password: TEST_DATA.password});
        expect(userHook.addUser).toHaveBeenCalledTimes(0);
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith({message: TEST_DATA.errorMessage} as AxiosError);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(TEST_DATA.errorMessage);
    });

    it("register (login error case)", async () => {
        const register = renderHook(AuthApi).result.current.register;
        apiClient.post.mockResolvedValueOnce();
        apiClient.post.mockRejectedValue({message: TEST_DATA.errorMessage} as AxiosError);
        await register({
            email: TEST_DATA.email,
            password: TEST_DATA.password,
            firstName: TEST_DATA.firstName,
            lastName: TEST_DATA.lastName,
            username: TEST_DATA.username
        });
        expect(apiClient.post).toHaveBeenCalledTimes(2);
        expect(apiClient.post).toHaveBeenLastCalledWith("/auth/login", {email: TEST_DATA.email, password: TEST_DATA.password});
        expect(userHook.addUser).toHaveBeenCalledTimes(0);
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith({message: TEST_DATA.errorMessage} as AxiosError);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(TEST_DATA.errorMessage);
    });

    it("register (profile creation error case)", async () => {
        const register = renderHook(AuthApi).result.current.register;
        apiClient.post.mockResolvedValueOnce();
        apiClient.post.mockResolvedValueOnce({id: TEST_DATA.id, accessToken: TEST_DATA.accessToken, refreshToken: TEST_DATA.refreshToken});
        apiClient.post.mockRejectedValue({message: TEST_DATA.errorMessage} as AxiosError);
        await register({
            email: TEST_DATA.email,
            password: TEST_DATA.password,
            firstName: TEST_DATA.firstName,
            lastName: TEST_DATA.lastName,
            username: TEST_DATA.username
        });
        expect(apiClient.post).toHaveBeenCalledTimes(3);
        expect(apiClient.post).toHaveBeenLastCalledWith("/profile/create", {
            firstName: TEST_DATA.firstName,
            lastName: TEST_DATA.lastName,
            username: TEST_DATA.username,
            account_id: TEST_DATA.id
        });
        expect(userHook.addUser).toHaveBeenCalledTimes(1);
        expect(userHook.addUser).toHaveBeenCalledWith(mockUser);
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith({message: TEST_DATA.errorMessage} as AxiosError);
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(TEST_DATA.errorMessage);
    });

    it("logout (normal case)", async () => {
        const logout = renderHook(AuthApi).result.current.logout;
        apiClient.post.mockResolvedValueOnce({});
        await logout();
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/logout", {id: mockUser.id});
        expect(userHook.removeUser).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledTimes(0);
        expect(mockAlert).toHaveBeenCalledTimes(0);
    });

    it("logout (error case)", async () => {
        const logout = renderHook(AuthApi).result.current.logout;
        apiClient.post.mockRejectedValue({message: TEST_DATA.errorMessage});
        await logout();
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/logout", {id: mockUser.id});
        expect(userHook.removeUser).toHaveBeenCalledTimes(0);
        expect(mockError).toHaveBeenCalledTimes(1);
        expect(mockError).toHaveBeenCalledWith({message: TEST_DATA.errorMessage});
        expect(mockAlert).toHaveBeenCalledTimes(1);
        expect(mockAlert).toHaveBeenCalledWith(TEST_DATA.errorMessage);
    });
});
