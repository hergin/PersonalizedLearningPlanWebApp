import { renderHook } from "@testing-library/react";
import AccountApi from "../account-api";
import { LoginProps, Role } from "../../../../types";
import { useApiConnection } from "../../../../hooks/useApiConnection";
import { useUser } from "../../hooks/useUser";
import { throwServerError } from "../../../../utils/errorHandlers";

jest.mock("../../../../hooks/useApiConnection");
jest.mock("../../hooks/useUser");
jest.mock("../../../../utils/errorHandlers");

const mockUser = {id: 1, role: "basic", accessToken: "access token", refreshToken: "refresh token"};
const TEST_DATA = {
    email: "example@gmail.com",
    password: "clever password",
    firstName: "Test",
    lastName: "Dummy",
    username: "Xx_TestDummy_xX",
};
const mockError = {message: "I'm in your walls."};

describe("Account Api Unit Tests", () => {
    var apiClient: any;
    var userHook: any;
    var mockServerThrower: jest.Mock<any, any, any>;

    beforeEach(() => {
        apiClient = useApiConnection();
        userHook = useUser();
        mockServerThrower = throwServerError as jest.Mock;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("login (normal case)", async () => {
        const { login } = renderHook(AccountApi).result.current;
        apiClient.post.mockResolvedValueOnce(mockUser);
        await login(TEST_DATA.email, TEST_DATA.password);
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {email: TEST_DATA.email, password: TEST_DATA.password});
        expect(userHook.addUser).toHaveBeenCalledTimes(1);
        expect(userHook.addUser).toHaveBeenCalledWith(mockUser);
        expect(mockServerThrower).toHaveBeenCalledTimes(0);
    });

    it("login (error case)", async () => {
        const { login } = renderHook(AccountApi).result.current;
        apiClient.post.mockRejectedValue(mockError);
        await login(TEST_DATA.email, TEST_DATA.password);
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {email: TEST_DATA.email, password: TEST_DATA.password});
        expect(userHook.addUser).toHaveBeenCalledTimes(0);
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(mockError);
    });

    it("register (normal case)", async () => {
        const { register } = renderHook(AccountApi).result.current;
        type T = {
            firstName: string,
            lastName: string,
            username: string,
            account_id: number
        };
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
                    if(values.firstName == TEST_DATA.firstName, values.lastName === TEST_DATA.lastName && values.username === TEST_DATA.username && values.account_id === mockUser.id) {
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
        expect(mockServerThrower).toHaveBeenCalledTimes(0);
    });

    it("register (registration error case)", async () => {
        const { register } = renderHook(AccountApi).result.current;
        apiClient.post.mockRejectedValue(mockError);
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
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(mockError);
    });

    it("register (login error case)", async () => {
        const { register } = renderHook(AccountApi).result.current;
        apiClient.post.mockResolvedValueOnce();
        apiClient.post.mockRejectedValue(mockError);
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
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(mockError);
    });

    it("register (profile creation error case)", async () => {
        const { register } = renderHook(AccountApi).result.current;
        apiClient.post.mockResolvedValueOnce();
        apiClient.post.mockResolvedValueOnce(mockUser);
        apiClient.post.mockRejectedValue(mockError);
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
            account_id: mockUser.id
        });
        expect(userHook.addUser).toHaveBeenCalledTimes(1);
        expect(userHook.addUser).toHaveBeenCalledWith(mockUser);
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(mockError);
    });

    it("logout (normal case)", async () => {
        const { logout } = renderHook(AccountApi).result.current;
        apiClient.post.mockResolvedValueOnce({});
        await logout();
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/logout", {id: mockUser.id});
        expect(userHook.removeUser).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledTimes(0);
    });

    it("logout (error case)", async () => {
        const { logout } = renderHook(AccountApi).result.current;
        apiClient.post.mockRejectedValue(mockError);
        await logout();
        expect(apiClient.post).toHaveBeenCalledTimes(1);
        expect(apiClient.post).toHaveBeenCalledWith("/auth/logout", {id: mockUser.id});
        expect(userHook.removeUser).toHaveBeenCalledTimes(0);
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(mockError);
    });

    it("Delete Account (normal case)", async () => {
        const { deleteAccount } = renderHook(AccountApi).result.current;
        apiClient.del.mockResolvedValue();
        await deleteAccount(mockUser.id);
        expect(apiClient.del).toHaveBeenCalledTimes(1);
        expect(apiClient.del).toHaveBeenCalledWith(`/auth/delete/${mockUser.id}`);
        expect(userHook.removeUser).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledTimes(0);
    });

    it("Delete Account (error case)", async () => {
        const { deleteAccount } = renderHook(AccountApi).result.current;
        apiClient.del.mockRejectedValue(mockError);
        await deleteAccount(mockUser.id);
        expect(apiClient.del).toHaveBeenCalledTimes(1);
        expect(apiClient.del).toHaveBeenCalledWith(`/auth/delete/${mockUser.id}`);
        expect(userHook.removeUser).toHaveBeenCalledTimes(0);
        expect(mockServerThrower).toHaveBeenCalledTimes(1);
        expect(mockServerThrower).toHaveBeenCalledWith(mockError);
    });
});
