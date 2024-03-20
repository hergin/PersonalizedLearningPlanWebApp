export const useProfile = (id: number) => ({
    data: [{}],
    isLoading: jest.fn(),
    error: jest.fn(),
});

export const useAllProfiles = () => ({
    data: [{}],
    isLoading: jest.fn(),
    error: jest.fn(),
});

export const useProfileCreator = (id: number) => ({
    mutateAsync: jest.fn(),
});

export const useProfileUpdater = (id: number) => ({
    mutateAsync: jest.fn(),
});
