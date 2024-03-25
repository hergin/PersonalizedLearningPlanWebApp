export const mockFetchSettings = jest.fn();
export const mockMutateSettings = jest.fn();

export const SettingsApi = () => ({
    FetchSettings: mockFetchSettings,
    MutateSettings: mockMutateSettings
});
