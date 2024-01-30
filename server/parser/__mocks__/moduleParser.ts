export const mockStoreModule = jest.fn();
export const mockParseModules = jest.fn();
export const mockUpdateModule = jest.fn();
export const mockDeleteModule = jest.fn();
export const mockGetModuleVariable = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        storeModule : mockStoreModule,
        parseModules : mockParseModules,
        updateModule : mockUpdateModule,
        deleteModule : mockDeleteModule,
        getModuleVariable : mockGetModuleVariable,
    }
});

export default mock;
