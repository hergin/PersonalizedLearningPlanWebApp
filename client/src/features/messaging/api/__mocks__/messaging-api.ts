export const mockGetMessagesBetween = jest.fn();
export const mockSendMessage = jest.fn();
export const mockEditMessage = jest.fn();
export const mockDeleteMessage = jest.fn();

const mock = () => ({
    getMessagesBetween: mockGetMessagesBetween,
    sendMessage: mockSendMessage,
    editMessage: mockEditMessage,
    deleteMessage: mockDeleteMessage,
});

export default mock;
