export const mockUseMessages = jest.fn();
export const useMessages = mockUseMessages;

export const mockCreatorMutateAsync = jest.fn();
export const useMessageCreator = () => ({
    mutateAsync: mockCreatorMutateAsync,
});

export const mockEditorMutateAsync = jest.fn();
export const useMessageEditor = () => ({
    mutateAsync: mockEditorMutateAsync,
});

export const mockRemoverMutateAsync = jest.fn();
export const useMessageRemover = () => ({
    mutateAsync: mockRemoverMutateAsync,
});
