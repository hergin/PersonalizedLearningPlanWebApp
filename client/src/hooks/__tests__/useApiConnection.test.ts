import { useApiConnection } from "../useApiConnection";
import { renderHook } from "@testing-library/react";

const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();
const mockDel = jest.fn();
jest.mock("axios", () => ({
    create: () => ({
        interceptors: {
            request: {
                use: jest.fn(),
            },
            response: {
                use: jest.fn(),
            },
        },
        get: mockGet,
        post: mockPost,
        put: mockPut,
        delete: mockDel,
    })
}));
jest.mock("../useAxiosInterceptorHandlers");

const TEST_RESPONSE = {
    data: [
        {
            message: "I'm in your walls."
        }
    ]
};

const TEST_BODY = {
    chest: "Chest",
    stomach: "Stomach",
    pelvis: "Pelvis"
};

describe("useApiConnection", () => {
    const { get, post, put, del } = renderHook(useApiConnection).result.current;
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("get (normal case)", async () => {
        mockGet.mockResolvedValueOnce(TEST_RESPONSE);
        const result = await get("/api/1");
        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(mockGet).toHaveBeenCalledWith("/api/1");
        expect(result).toEqual(TEST_RESPONSE.data);
    });

    it("post (normal case)", async () => {
        mockPost.mockResolvedValueOnce(TEST_RESPONSE);
        const result = await post("/api/create", TEST_BODY);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(mockPost).toHaveBeenCalledWith("/api/create", TEST_BODY);
        expect(result).toEqual(TEST_RESPONSE.data);
    });

    it("put (normal case)", async () => {
        const route = "/api/update/1";
        mockPut.mockResolvedValueOnce(TEST_RESPONSE);
        const result = await put(route, TEST_BODY);
        expect(mockPut).toHaveBeenCalledTimes(1);
        expect(mockPut).toHaveBeenCalledWith(route, TEST_BODY);
        expect(result).toEqual(TEST_RESPONSE.data);
    });

    it("del (normal case)", async () => {
        const route = "/api/delete/1";
        mockDel.mockResolvedValueOnce(TEST_RESPONSE);
        const result = await del(route);
        expect(mockDel).toHaveBeenCalledTimes(1);
        expect(mockDel).toHaveBeenCalledWith(route);
        expect(result).toEqual(TEST_RESPONSE.data);
    });
});
