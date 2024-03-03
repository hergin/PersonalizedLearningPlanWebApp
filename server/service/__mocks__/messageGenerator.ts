export const mockGetMessage = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getMessage: mockGetMessage
    }
});

export default mock;
