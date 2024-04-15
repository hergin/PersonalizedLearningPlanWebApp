export const mockQuery = jest.fn();

export const Pool = jest.fn().mockImplementation(() => {
    return {
        query: mockQuery,
    }
});

const mock = () => ({
    Pool 
});

export default mock;
