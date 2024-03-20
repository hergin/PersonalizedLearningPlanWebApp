export const mockLoginMutateAsync = jest.fn();
export const mockRegistrationMutateAsync = jest.fn();
export const mockLogoutMutateAsync = jest.fn();
export const mockDeletionMutateAsync = jest.fn();

export const useLoginService = () => ({
    mutateAsync: mockLoginMutateAsync,
});

export const useRegistrationService = () => ({
    mutateAsync: mockRegistrationMutateAsync,
});

export const useLogoutService = () => ({
    mutateAsync: mockLogoutMutateAsync,
});

export const useDeletionService = () => ({
    mutateAsync: mockDeletionMutateAsync
});
