export const mockGetAllProfiles = jest.fn();
export const mockGetProfile = jest.fn();
export const mockCreateProfile = jest.fn();
export const mockUpdateProfile = jest.fn();
export const mockDeleteProfile = jest.fn();
export const mockGetUserData = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getAllProfiles: mockGetAllProfiles,
        getProfile: mockGetProfile,
        createProfile: mockCreateProfile,
        updateProfile: mockUpdateProfile,
        deleteProfile: mockDeleteProfile,
    }
});

export default mock;
