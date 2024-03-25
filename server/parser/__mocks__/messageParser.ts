export const mockParseAllMessagesFrom = jest.fn();
export const mockParseChat = jest.fn();
export const mockStoreMessage = jest.fn();
export const mockEditMessage = jest.fn();
export const mockDeleteMessage = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        parseAllMessagesFrom: mockParseAllMessagesFrom,
        parseChat: mockParseChat,
        storeMessage: mockStoreMessage,
        editMessage: mockEditMessage,
        deleteMessage: mockDeleteMessage,
    }
});

export default mock;
