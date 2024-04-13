export const mockFetchTags = jest.fn();
export const mockCreateTag = jest.fn();
export const mockDeleteTag = jest.fn();

const mock = () => ({
    fetchTags: mockFetchTags,
    createTag: mockCreateTag,
    deleteTag: mockDeleteTag
});

export default mock;
