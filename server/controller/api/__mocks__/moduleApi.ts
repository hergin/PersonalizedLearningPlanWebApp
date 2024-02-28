export const mockGetModules = jest.fn();
export const mockCreateModule = jest.fn();
export const mockUpdateModule = jest.fn();
export const mockDeleteModule = jest.fn();
export const mockGetModuleVariable = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getModules: mockGetModules,
        createModule: mockCreateModule,
        updateModule: mockUpdateModule,
        deleteModule: mockDeleteModule,
        getModuleVariable: mockGetModuleVariable,
    };
});

export default mock;
