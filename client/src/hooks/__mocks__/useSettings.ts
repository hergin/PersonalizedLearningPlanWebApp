export const useSettings = () => ({
    data: null,
    isLoading: true,
    error: false,
});

export const useSettingsMutation = () => ({
    mutateAsync: jest.fn(),
});
