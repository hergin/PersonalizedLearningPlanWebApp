import { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import useAxiosInterceptorHandlers from "../useAxiosInterceptorHandlers";
import { renderHook } from "@testing-library/react";

var mockUser = {id: 1, accessToken: "access token", refreshToken: "refresh token"};
const mockReplaceToken = jest.fn();
jest.mock("../../features/login/hooks/useUser", () => ({
    useUser: () => ({
        user: mockUser,
        replaceToken: mockReplaceToken,
    }),
}));

const TEST_CONFIG: InternalAxiosRequestConfig = {
    baseURL: "http://localhost:4000/api",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: null,
    } as AxiosRequestHeaders
};

const TEST_ERROR: AxiosError = {
    response: {
        status: 401,
    } as AxiosResponse,
    config: {
        baseUrl: "http://localhost:4000/api",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer ",
        } as AxiosRequestHeaders
    }
} as unknown as AxiosError;

const mockPost = jest.fn();

describe("useAxiosInterceptorHandlers Unit Tests", () => {
    var testInstance: AxiosInstance;
    
    beforeEach(() => {
        const instance = ((config: AxiosRequestConfig) => {return Promise.resolve()}) as AxiosInstance;
        instance.post = mockPost;
        testInstance = instance;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("onRequest", () => {
        const { onRequest } = renderHook(() => useAxiosInterceptorHandlers(testInstance)).result.current;
        const result = onRequest(TEST_CONFIG);
        expect(result).toEqual({
            baseURL: "http://localhost:4000/api",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${mockUser.accessToken}`,
            } as AxiosRequestHeaders
        });
    });

    it("onResponseError (refresh case)", async () => {
        mockPost.mockResolvedValueOnce({data: "new token"});
        const { onResponseError } = renderHook(() => useAxiosInterceptorHandlers(testInstance)).result.current;
        await onResponseError(TEST_ERROR);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("/token", JSON.stringify({id: mockUser.id, refreshToken: mockUser.refreshToken}));
        expect(mockReplaceToken).toHaveBeenCalledTimes(1);
        expect(mockReplaceToken).toHaveBeenCalledWith("new token");
    });

    it("onResponseError (without error config)", async () => {
        const { onResponseError } = renderHook(() => useAxiosInterceptorHandlers(testInstance)).result.current;
        expect(async () => await onResponseError({response: TEST_ERROR.response} as AxiosError))
            .rejects.toEqual({response: TEST_ERROR.response} as AxiosError);
        expect(mockPost).toHaveBeenCalledTimes(0);
        expect(mockReplaceToken).toHaveBeenCalledTimes(0);
        
    });

    it("onResponseError (server side error case)", async () => {
        mockPost.mockRejectedValue({});
        const { onResponseError } = renderHook(() => useAxiosInterceptorHandlers(testInstance)).result.current;
        expect(async () => await onResponseError(TEST_ERROR)).rejects.toEqual(TEST_ERROR);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("/token", JSON.stringify({id: mockUser.id, refreshToken: mockUser.refreshToken}));
        expect(mockReplaceToken).toHaveBeenCalledTimes(0);
    });
});
