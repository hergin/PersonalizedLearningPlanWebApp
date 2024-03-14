import { renderHook } from "@testing-library/react";
import { AuthApi } from "../../api/auth-api";
import { LoginProps } from "../../../../types";
import { ApiClient } from "../../../../hooks/ApiClient";
import { useUser } from "../../hooks/useUser";

jest.mock("../../../../hooks/ApiClient");
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
    refreshToken: "refresh token"
};

describe("AuthApi Unit Tests", () => {
    var apiClient: any;
    var userHook: any;

    beforeEach(() => {
        apiClient = ApiClient();
        userHook = useUser();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("login", async () => {
        const login = renderHook(AuthApi).result.current.login;
        apiClient.post.mockResolvedValueOnce({id: TEST_DATA.id, accessToken: TEST_DATA.accessToken, refreshToken: TEST_DATA.refreshToken});
        await login(TEST_DATA.email, TEST_DATA.password);
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {email: TEST_DATA.email, password: TEST_DATA.password});
        expect(userHook.addUser).toHaveBeenCalledTimes(1);
        expect(userHook.addUser).toHaveBeenCalledWith({id: TEST_DATA.id, accessToken: TEST_DATA.accessToken, refreshToken: TEST_DATA.refreshToken});
    });

    it("register", async () => {
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
    });

    it("logout", async () => {
        const logout = renderHook(AuthApi).result.current.logout;
        apiClient.post.mockResolvedValueOnce({});
        await logout();
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/logout", {id: mockUser.id});
        expect(userHook.removeUser).toHaveBeenCalledTimes(1);
    });
});
