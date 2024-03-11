export const mockParseTags = jest.fn();
export const mockStoreTag = jest.fn();
export const mockDeleteTag = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        parseTags: mockParseTags,
        storeTag: mockStoreTag,
        deleteTag: mockDeleteTag,
    }
});

export default mock;
