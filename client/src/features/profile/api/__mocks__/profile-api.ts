export const mockFetchProfile = jest.fn();
export const mockFetchCoaches = jest.fn();
export const mockCreateProfile = jest.fn();
export const mockUpdateProfile = jest.fn();

const mock = () => ({
    FetchProfile: mockFetchProfile,
    fetchCoaches: mockFetchCoaches,
    CreateProfile: mockCreateProfile,
    UpdateProfile: mockUpdateProfile
});

export default mock;
