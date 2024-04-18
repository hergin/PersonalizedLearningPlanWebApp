import * as MessageProcessor from "../messageProcessor";
import MessageApi from "../../api/messageApi";
import { createMockRequest, MOCK_RESPONSE } from "../../global/mockValues";
import { getLoginError } from "../../../utils/errorHandlers";
import { CreatedMessage, STATUS_CODE } from "../../../types";

jest.mock("../../api/messageApi");

const mockMessageId = -1;
const mockSenderId = 0;
const mockRecipientId = 1;
const TEST_MESSAGE: CreatedMessage[] = [
    {
        content: "Hi!",
        senderId: mockSenderId,
        recipientId: mockRecipientId
    },
    {
        content: "How are you??",
        senderId: mockRecipientId,
        recipientId: mockSenderId
    }
];

describe("Message Processor Unit Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Get All Sent Messages (normal case)", async () => {
        const mockGetAllSentMessages = new MessageApi().getAllSentMessages as jest.Mock;
        mockGetAllSentMessages.mockResolvedValueOnce([TEST_MESSAGE[0]]);
        const mRequest = createMockRequest({}, {id: mockSenderId});
        await MessageProcessor.getAllSentMessages(mRequest, MOCK_RESPONSE);
        expect(mockGetAllSentMessages).toHaveBeenCalledTimes(1);
        expect(mockGetAllSentMessages).toHaveBeenCalledWith(mockSenderId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_MESSAGE[0]]);
    });

    it("Get All Sent Messages (error case)", async () => {
        const mockGetAllSentMessages = new MessageApi().getAllSentMessages as jest.Mock;
        mockGetAllSentMessages.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({}, {id: mockSenderId});
        await MessageProcessor.getAllSentMessages(mRequest, MOCK_RESPONSE);
        expect(mockGetAllSentMessages).toHaveBeenCalledTimes(1);
        expect(mockGetAllSentMessages).toHaveBeenCalledWith(mockSenderId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.BAD_REQUEST));
    });

    it("Get Chat Messages (normal case)", async () => {
        const mockGetChatMessages = new MessageApi().getChatMessages as jest.Mock;
        mockGetChatMessages.mockResolvedValueOnce(TEST_MESSAGE);
        const mRequest = createMockRequest({}, {id: mockSenderId, receivedId: mockRecipientId});
        await MessageProcessor.getMessagesBetween(mRequest, MOCK_RESPONSE);
        expect(mockGetChatMessages).toHaveBeenCalledTimes(1);
        expect(mockGetChatMessages).toHaveBeenCalledWith(mockSenderId, mockRecipientId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it("Get Chat Messages (error case)", async () => {
        const mockGetChatMessages = new MessageApi().getChatMessages as jest.Mock;
        mockGetChatMessages.mockResolvedValueOnce(STATUS_CODE.CONFLICT);
        const mRequest = createMockRequest({}, {id: mockSenderId, receivedId: mockRecipientId});
        await MessageProcessor.getMessagesBetween(mRequest, MOCK_RESPONSE);
        expect(mockGetChatMessages).toHaveBeenCalledTimes(1);
        expect(mockGetChatMessages).toHaveBeenCalledWith(mockSenderId, mockRecipientId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.CONFLICT));
    });

    it("Post Message (normal case)", async () => {
        const mockSendMessage = new MessageApi().sendMessage as jest.Mock;
        mockSendMessage.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({
            ...TEST_MESSAGE[0],
            recipient_id: mockRecipientId,
            sender_id: mockSenderId
        });
        await MessageProcessor.postMessage(mRequest, MOCK_RESPONSE);
        expect(mockSendMessage).toHaveBeenCalledTimes(1);
        expect(mockSendMessage).toHaveBeenCalledWith(TEST_MESSAGE[0]);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("Post Message (error case)", async () => {
        const mockSendMessage = new MessageApi().sendMessage as jest.Mock;
        mockSendMessage.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({
            ...TEST_MESSAGE[0],
            recipient_id: mockRecipientId,
            sender_id: mockSenderId
        });
        await MessageProcessor.postMessage(mRequest, MOCK_RESPONSE);
        expect(mockSendMessage).toHaveBeenCalledTimes(1);
        expect(mockSendMessage).toHaveBeenCalledWith(TEST_MESSAGE[0]);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });

    it("Put Message (normal case)", async () => {
        const mockEditMessage = new MessageApi().editMessage as jest.Mock;
        mockEditMessage.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({content: TEST_MESSAGE[0].content}, {id: mockMessageId});
        await MessageProcessor.putMessage(mRequest, MOCK_RESPONSE);
        expect(mockEditMessage).toHaveBeenCalledTimes(1);
        expect(mockEditMessage).toHaveBeenCalledWith(mockMessageId, TEST_MESSAGE[0].content);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("Put Message (error case)", async () => {
        const mockEditMessage = new MessageApi().editMessage as jest.Mock;
        mockEditMessage.mockResolvedValueOnce(STATUS_CODE.GONE);
        const mRequest = createMockRequest({content: TEST_MESSAGE[0].content}, {id: mockMessageId});
        await MessageProcessor.putMessage(mRequest, MOCK_RESPONSE);
        expect(mockEditMessage).toHaveBeenCalledTimes(1);
        expect(mockEditMessage).toHaveBeenCalledWith(mockMessageId, TEST_MESSAGE[0].content);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.GONE));
    });

    it("Delete Message (normal case)", async () => {
        const mockDeleteMessage = new MessageApi().deleteMessage as jest.Mock;
        mockDeleteMessage.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({}, {id: mockMessageId});
        await MessageProcessor.deleteMessage(mRequest, MOCK_RESPONSE);
        expect(mockDeleteMessage).toHaveBeenCalledTimes(1);
        expect(mockDeleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("Delete Message (error case)", async () => {
        const mockDeleteMessage = new MessageApi().deleteMessage as jest.Mock;
        mockDeleteMessage.mockResolvedValueOnce(STATUS_CODE.GONE);
        const mRequest = createMockRequest({}, {id: mockMessageId});
        await MessageProcessor.deleteMessage(mRequest, MOCK_RESPONSE);
        expect(mockDeleteMessage).toHaveBeenCalledTimes(1);
        expect(mockDeleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.GONE));
    });
});
