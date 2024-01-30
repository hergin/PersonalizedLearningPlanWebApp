export const mockStoreLogin = jest.fn();
export const mockRetrieveLogin = jest.fn();
export const mockStoreToken = jest.fn();
export const mockParseToken = jest.fn();
export const mockDeleteToken = jest.fn();
export const mockDeleteAccount = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        storeLogin : mockStoreLogin,
        retrieveLogin : mockRetrieveLogin,
        storeToken : mockStoreToken,
        parseToken : mockParseToken,
        deleteToken : mockDeleteToken,
        deleteAccount : mockDeleteAccount
    }
});

export default mock;
