export const mockGetInviteWithId = jest.fn();
export const mockGetInviteWithAccounts = jest.fn();
export const mockGetInvites = jest.fn();
export const mockGetPendingInvites = jest.fn();
export const mockCreateInvite = jest.fn();
export const mockAcceptInvite = jest.fn();
export const mockDeleteInvite = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getInviteWithId: mockGetInviteWithId,
        getInviteWithAccounts: mockGetInviteWithAccounts,
        getInvites: mockGetInvites,
        getPendingInvites: mockGetPendingInvites,
        createInvite: mockCreateInvite,
        acceptInvite: mockAcceptInvite,
        deleteInvite: mockDeleteInvite
    }
});

export default mock;
