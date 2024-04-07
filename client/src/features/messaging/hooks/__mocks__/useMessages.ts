export const mockIsLoading = jest.fn();
export const mockError = jest.fn();
export const mockCreatorMutateAsync = jest.fn();
export const mockEditorMutateAsync = jest.fn();
export const mockRemoverMutateAsync = jest.fn();

export const useMessages = () => ({
    data: [{}],
    isLoading: mockIsLoading,
    error: mockError
});

export const useMessageCreator = () => ({
    mutateAsync: mockCreatorMutateAsync,
});

export const useMessageEditor = () => ({
    mutateAsync: mockEditorMutateAsync,
});

export const useMessageRemover = () => ({
    mutateAsync: mockRemoverMutateAsync,
});
