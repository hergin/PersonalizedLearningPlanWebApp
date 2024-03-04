import { useSessionStorage } from "../useSessionStorage";
import { renderHook, act } from "@testing-library/react";

const TEST_DATA = {
    key: "your ip address",
    value: "114.224.35.196"
}

describe('Use Session Storage Unit Tests', () => {
    afterEach(() => {
        sessionStorage.clear();
    });
    
    it("set item", () => {
        const { result } = renderHook(useSessionStorage);
        act(() => result.current.setItem(TEST_DATA.key, TEST_DATA.value));
        expect(sessionStorage.getItem(TEST_DATA.key)).toEqual(TEST_DATA.value);
        expect(result.current.value).toEqual(TEST_DATA.value);
    });

    it("get item", () => {
        const { result } = renderHook(useSessionStorage);
        sessionStorage.setItem(TEST_DATA.key, TEST_DATA.value);
        const actual = result.current.getItem(TEST_DATA.key);
        expect(actual).toEqual(TEST_DATA.value);
    });

    it("remove item", () => {
        const { result } = renderHook(useSessionStorage);
        sessionStorage.setItem(TEST_DATA.key, TEST_DATA.value);
        act(() => result.current.removeItem(TEST_DATA.key));
        expect(sessionStorage.getItem(TEST_DATA.key)).toEqual(null);
        expect(result.current.value).toEqual(null);
    });
});
