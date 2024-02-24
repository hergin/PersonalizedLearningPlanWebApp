export const mockStoreProfile = jest.fn();
export const mockParseProfile = jest.fn();
export const mockUpdateProfile = jest.fn();
export const mockDeleteProfile = jest.fn();
export const mockParseUserData = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        storeProfile : mockStoreProfile,
        parseProfile : mockParseProfile,
        updateProfile : mockUpdateProfile,
        deleteProfile : mockDeleteProfile,
        parseUserData: mockParseUserData,
    }
});

export default mock;
