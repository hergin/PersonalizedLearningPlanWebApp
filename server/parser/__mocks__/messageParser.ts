export const mockParseChat = jest.fn();
export const mockStoreMessage = jest.fn();
export const mockDeleteMessage = jest.fn();

const mock = jest.fn().mockImplementation(() => {
    return {
        parseChat: mockParseChat,
        storeMessage: mockStoreMessage,
        deleteMessage: mockDeleteMessage,
    }
});

export default mock;
