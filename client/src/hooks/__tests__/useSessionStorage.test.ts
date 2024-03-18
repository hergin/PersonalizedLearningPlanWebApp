import { useSessionStorage } from "../useSessionStorage";
import { renderHook, act } from "@testing-library/react";

const TEST_DATA = {
    key: "your ip address",
    value: "114.224.35.196"
}

const mockSetItem = jest.fn();
const mockGetItem = jest.fn();
const mockRemoveItem = jest.fn();

describe('Use Session Storage Unit Tests', () => {
    beforeAll(() => {
        global.Storage.prototype.setItem = mockSetItem;
        global.Storage.prototype.getItem = mockGetItem;
        global.Storage.prototype.removeItem = mockRemoveItem;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("set item", () => {
        const { result } = renderHook(useSessionStorage);
        act(() => result.current.setItem(TEST_DATA.key, TEST_DATA.value));
        expect(mockSetItem).toHaveBeenCalledTimes(1);
        expect(mockSetItem).toHaveBeenCalledWith(TEST_DATA.key, TEST_DATA.value);
        expect(result.current.value).toEqual(TEST_DATA.value);
    });

    it("get item", () => {
        mockGetItem.mockReturnValue(TEST_DATA.value);
        const { result } = renderHook(useSessionStorage);
        const actual = result.current.getItem(TEST_DATA.key);
        expect(mockGetItem).toHaveBeenCalledTimes(1);
        expect(mockGetItem).toHaveBeenCalledWith(TEST_DATA.key);
        expect(actual).toEqual(TEST_DATA.value);
    });

    it("remove item", () => {
        const { result } = renderHook(useSessionStorage);
        act(() => result.current.removeItem(TEST_DATA.key));
        expect(mockRemoveItem).toHaveBeenCalledTimes(1);
        expect(mockRemoveItem).toHaveBeenCalledWith(TEST_DATA.key);
        expect(result.current.value).toEqual(null);
    });
});
