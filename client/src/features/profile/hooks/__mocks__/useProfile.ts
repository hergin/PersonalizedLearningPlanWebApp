export const mockIsLoading = jest.fn();
export const mockError = jest.fn();
export const mockAllIsLoading = jest.fn();
export const mockAllError = jest.fn();
export const mockCreatorMutateAsync = jest.fn();
export const mockUpdaterMutateAsync = jest.fn();

export const useProfile = (id: number) => ({
    data: [{}],
    isLoading: mockIsLoading,
    error: mockError,
});

export const useAllProfiles = () => ({
    data: [{}],
    isLoading: mockAllIsLoading,
    error: mockAllError,
});

export const useProfileCreator = (id: number) => ({
    mutateAsync: mockCreatorMutateAsync,
});

export const useProfileUpdater = (id: number) => ({
    mutateAsync: mockUpdaterMutateAsync,
});
