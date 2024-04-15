export const mockSetItem = jest.fn();
export const mockGetItem = jest.fn();
export const mockRemoveItem = jest.fn();

export const useSessionStorage = () => ({
    setItem: mockSetItem,
    getItem: mockGetItem,
    removeItem: mockRemoveItem,
});
