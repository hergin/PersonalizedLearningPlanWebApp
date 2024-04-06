export const mockParseAllUserData = jest.fn();
export const mockParseUserData = jest.fn();
export const mockSetAccountAsRole = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        parseAllUserData: mockParseAllUserData,
        parseUserData: mockParseUserData,
        setAccountAsRole: mockSetAccountAsRole,
    }
});

export default mock;
