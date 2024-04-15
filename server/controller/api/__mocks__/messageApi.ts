export const mockGetAllSentMessages = jest.fn();
export const mockGetChatMessages = jest.fn();
export const mockSendMessage = jest.fn();
export const mockEditMessage = jest.fn();
export const mockDeleteMessage = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        getAllSentMessages: mockGetAllSentMessages,
        getChatMessages: mockGetChatMessages,
        sendMessage: mockSendMessage,
        editMessage: mockEditMessage,
        deleteMessage: mockDeleteMessage
    }
});

export default mock;
