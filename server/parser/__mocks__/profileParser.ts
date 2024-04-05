export const mockStoreProfile = jest.fn();
export const mockParseCoachProfiles = jest.fn();
export const mockParseProfile = jest.fn();
export const mockUpdateProfile = jest.fn();
export const mockDeleteProfile = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        storeProfile : mockStoreProfile,
        parseProfile : mockParseProfile,
        updateProfile : mockUpdateProfile,
        deleteProfile : mockDeleteProfile,
        parseCoachProfiles: mockParseCoachProfiles,
    }
});

export default mock;
