import * as MessageProcessor from "../messageProcessor";
import MessageApi from "../../api/messageApi";
import { createMockRequest, MOCK_RESPONSE } from "../../global/mockValues";
import { getLoginError } from "../../../utils/errorHandlers";
import { Message, STATUS_CODE } from "../../../types";

jest.mock("../../api/messageApi");

const mockMessageId = -1;
const mockSenderId = 0;
const mockRecipientId = 1;
const TEST_MESSAGE: Message[] = [
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
    var api: any = new MessageApi();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Get All Sent Messages (normal case)", async () => {
        api.getAllSentMessages.mockResolvedValueOnce([TEST_MESSAGE[0]]);
        const mRequest = createMockRequest({}, {id: mockSenderId});
        await MessageProcessor.getAllSentMessages(mRequest, MOCK_RESPONSE);
        expect(api.getAllSentMessages).toHaveBeenCalledTimes(1);
        expect(api.getAllSentMessages).toHaveBeenCalledWith(mockSenderId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_MESSAGE[0]]);
    });

    it("Get All Sent Messages (error case)", async () => {
        api.getAllSentMessages.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({}, {id: mockSenderId});
        await MessageProcessor.getAllSentMessages(mRequest, MOCK_RESPONSE);
        expect(api.getAllSentMessages).toHaveBeenCalledTimes(1);
        expect(api.getAllSentMessages).toHaveBeenCalledWith(mockSenderId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.BAD_REQUEST));
    });

    it("Get Chat Messages (normal case)", async () => {
        api.getChatMessages.mockResolvedValueOnce(TEST_MESSAGE);
        const mRequest = createMockRequest({}, {id: mockSenderId, receivedId: mockRecipientId});
        await MessageProcessor.getMessagesBetween(mRequest, MOCK_RESPONSE);
        expect(api.getChatMessages).toHaveBeenCalledTimes(1);
        expect(api.getChatMessages).toHaveBeenCalledWith(mockSenderId, mockRecipientId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it("Get Chat Messages (error case)", async () => {
        api.getChatMessages.mockResolvedValueOnce(STATUS_CODE.CONFLICT);
        const mRequest = createMockRequest({}, {id: mockSenderId, receivedId: mockRecipientId});
        await MessageProcessor.getMessagesBetween(mRequest, MOCK_RESPONSE);
        expect(api.getChatMessages).toHaveBeenCalledTimes(1);
        expect(api.getChatMessages).toHaveBeenCalledWith(mockSenderId, mockRecipientId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.CONFLICT));
    });

    it("Post Message (normal case)", async () => {
        api.sendMessage.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({
            ...TEST_MESSAGE[0],
            recipient_id: mockRecipientId,
            sender_id: mockSenderId
        });
        await MessageProcessor.postMessage(mRequest, MOCK_RESPONSE);
        expect(api.sendMessage).toHaveBeenCalledTimes(1);
        expect(api.sendMessage).toHaveBeenCalledWith(TEST_MESSAGE[0]);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("Post Message (error case)", async () => {
        api.sendMessage.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({
            ...TEST_MESSAGE[0],
            recipient_id: mockRecipientId,
            sender_id: mockSenderId
        });
        await MessageProcessor.postMessage(mRequest, MOCK_RESPONSE);
        expect(api.sendMessage).toHaveBeenCalledTimes(1);
        expect(api.sendMessage).toHaveBeenCalledWith(TEST_MESSAGE[0]);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
    });

    it("Put Message (normal case)", async () => {
        api.editMessage.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({content: TEST_MESSAGE[0].content}, {id: mockMessageId});
        await MessageProcessor.putMessage(mRequest, MOCK_RESPONSE);
        expect(api.editMessage).toHaveBeenCalledTimes(1);
        expect(api.editMessage).toHaveBeenCalledWith(mockMessageId, TEST_MESSAGE[0].content);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("Put Message (error case)", async () => {
        api.editMessage.mockResolvedValueOnce(STATUS_CODE.GONE);
        const mRequest = createMockRequest({content: TEST_MESSAGE[0].content}, {id: mockMessageId});
        await MessageProcessor.putMessage(mRequest, MOCK_RESPONSE);
        expect(api.editMessage).toHaveBeenCalledTimes(1);
        expect(api.editMessage).toHaveBeenCalledWith(mockMessageId, TEST_MESSAGE[0].content);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.GONE));
    });

    it("Delete Message (normal case)", async () => {
        api.deleteMessage.mockResolvedValueOnce(STATUS_CODE.OK);
        const mRequest = createMockRequest({}, {id: mockMessageId});
        await MessageProcessor.deleteMessage(mRequest, MOCK_RESPONSE);
        expect(api.deleteMessage).toHaveBeenCalledTimes(1);
        expect(api.deleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("Delete Message (error case)", async () => {
        api.deleteMessage.mockResolvedValueOnce(STATUS_CODE.GONE);
        const mRequest = createMockRequest({}, {id: mockMessageId});
        await MessageProcessor.deleteMessage(mRequest, MOCK_RESPONSE);
        expect(api.deleteMessage).toHaveBeenCalledTimes(1);
        expect(api.deleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.GONE));
    });
});
