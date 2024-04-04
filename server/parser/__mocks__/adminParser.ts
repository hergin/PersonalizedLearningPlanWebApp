export const mockParseAllUserData = jest.fn();
export const mockParseUserData = jest.fn();
export const mockSetAccountAsCoach = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        parseAllUserData: mockParseAllUserData,
        parseUserData: mockParseUserData,
        setAccountAsCoach: mockSetAccountAsCoach,
    }
});

export type mockAdminParser = {
    parseAllUserData: jest.Mock<any, any, any>,
    parseUserData: jest.Mock<any, any, any>,
    setAccountAsCoach: jest.Mock<any, any, any>,
}

export default mock;
