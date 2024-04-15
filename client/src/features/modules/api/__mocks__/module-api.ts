export const mockFetchModules = jest.fn();
export const mockCreateModule = jest.fn();
export const mockUpdateModule = jest.fn();
export const mockDeleteModule = jest.fn();

export const ModuleApi = () => ({
    fetchModules: mockFetchModules,
    createModule: mockCreateModule,
    updateModule: mockUpdateModule,
    deleteModule: mockDeleteModule,
});
