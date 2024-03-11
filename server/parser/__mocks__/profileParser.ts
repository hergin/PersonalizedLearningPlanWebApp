export const mockStoreProfile = jest.fn();
export const mockParseAllProfiles = jest.fn();
export const mockParseProfile = jest.fn();
export const mockUpdateProfile = jest.fn();
export const mockDeleteProfile = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        storeProfile : mockStoreProfile,
        parseProfile : mockParseProfile,
        updateProfile : mockUpdateProfile,
        deleteProfile : mockDeleteProfile,
        parseAllProfiles: mockParseAllProfiles,
    }
});

export default mock;
