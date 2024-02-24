export const mockGetProfile = jest.fn();
export const mockCreateProfile = jest.fn();
export const mockUpdateProfile = jest.fn();
export const mockDeleteProfile = jest.fn();
export const mockGetUserData = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getProfile: mockGetProfile,
        createProfile: mockCreateProfile,
        updateProfile: mockUpdateProfile,
        deleteProfile: mockDeleteProfile,
        getUserData: mockGetUserData
    }
});

export default mock;
