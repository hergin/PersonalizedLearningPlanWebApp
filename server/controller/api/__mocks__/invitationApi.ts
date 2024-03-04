export const mockGetInvites = jest.fn();
export const mockGetPendingInvites = jest.fn();
export const mockCreateInvite = jest.fn();
export const mockAcceptInvite = jest.fn();
export const mockRejectInvite = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getInvites: mockGetInvites,
        getPendingInvites: mockGetPendingInvites,
        createInvite: mockCreateInvite,
        acceptInvite: mockAcceptInvite,
        rejectInvite: mockRejectInvite
    }
});

export default mock;
