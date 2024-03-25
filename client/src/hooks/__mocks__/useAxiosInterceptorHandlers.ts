export const mockOnRequest = jest.fn();
export const mockOnResponseError = jest.fn();

const mock = () => ({
    onRequest: mockOnRequest,
    onResponseError: mockOnResponseError
});

export default mock;
