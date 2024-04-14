const mockUseModules = jest.fn();
export const useModules = mockUseModules;

const mockCreationMutateAsync = jest.fn();
export const useModuleCreator = () => ({
    mutateAsync: mockCreationMutateAsync,
});

const mockUpdateMutateAsync = jest.fn();
export const useModuleUpdater = () => ({
    mutateAsync: mockUpdateMutateAsync,
});

const mockRemoveMutateAsync = jest.fn();
export const useModuleRemover = () => ({
    mutateAsync: mockRemoveMutateAsync,
});
