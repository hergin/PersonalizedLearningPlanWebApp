export const mockGetTags = jest.fn();
export const mockAddTag = jest.fn();
export const mockDeleteTag = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getTags: mockGetTags,
        addTag: mockAddTag,
        deleteTag: mockDeleteTag
    };
});

export default mock;
