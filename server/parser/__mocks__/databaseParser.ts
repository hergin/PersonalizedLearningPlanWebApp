export const mockParseDatabase = jest.fn();
export const mockUpdateDatabase = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        parseDatabase: mockParseDatabase,
        updateDatabase: mockUpdateDatabase
    };
});

export default mock;
