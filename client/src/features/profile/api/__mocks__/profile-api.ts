export const mockFetchProfile = jest.fn();
export const mockFetchAllProfiles = jest.fn();
export const mockCreateProfile = jest.fn();
export const mockUpdateProfile = jest.fn();

const mock = () => ({
    FetchProfile: mockFetchProfile,
    FetchAllProfiles: mockFetchAllProfiles,
    CreateProfile: mockCreateProfile,
    UpdateProfile: mockUpdateProfile
});

export default mock;
