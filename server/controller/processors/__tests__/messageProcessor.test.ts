import * as MessageProcessor from "../messageProcessor";
import MessageApi from "../../api/messageApi";
import { createMockRequest, MOCK_RESPONSE } from "../../global/mockValues";
import { initializeErrorMap } from "../../../utils/errorMessages";
import { Message, StatusCode } from "../../../types";

jest.mock("../../api/messageApi");

const ERROR_MESSAGES = initializeErrorMap();
const mockMessageId = -1;
const mockSenderId = 0;
const mockRecipientId = 1;
const TEST_MESSAGE: Message[] = [
    {
        content: "Hi!",
        date: "",
        senderId: mockSenderId,
        recipientId: mockRecipientId
    },
    {
        content: "How are you??",
        date: "",
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
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_MESSAGE[0]]);
    });

    it("Get All Sent Messages (error case)", async () => {
        api.getAllSentMessages.mockResolvedValueOnce(StatusCode.BAD_REQUEST);
        const mRequest = createMockRequest({}, {id: mockSenderId});
        await MessageProcessor.getAllSentMessages(mRequest, MOCK_RESPONSE);
        expect(api.getAllSentMessages).toHaveBeenCalledTimes(1);
        expect(api.getAllSentMessages).toHaveBeenCalledWith(mockSenderId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.BAD_REQUEST));
    });

    it("Get Chat Messages (normal case)", async () => {
        api.getChatMessages.mockResolvedValueOnce(TEST_MESSAGE);
        const mRequest = createMockRequest({}, {id: mockSenderId, recipientId: mockRecipientId});
        await MessageProcessor.getMessagesBetween(mRequest, MOCK_RESPONSE);
        expect(api.getChatMessages).toHaveBeenCalledTimes(1);
        expect(api.getChatMessages).toHaveBeenCalledWith(mockSenderId, mockRecipientId);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith(TEST_MESSAGE);
    });

    it("Get Chat Messages (error case)", async () => {
        api.getChatMessages.mockResolvedValueOnce(StatusCode.CONFLICT);
        const mRequest = createMockRequest({}, {id: mockSenderId, recipientId: mockRecipientId});
        await MessageProcessor.getMessagesBetween(mRequest, MOCK_RESPONSE);
        expect(api.getChatMessages).toHaveBeenCalledTimes(1);
        expect(api.getChatMessages).toHaveBeenCalledWith(mockSenderId, mockRecipientId);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.CONFLICT));
    });

    it("Post Message (normal case)", async () => {
        api.sendMessage.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest(TEST_MESSAGE[0]);
        await MessageProcessor.postMessage(mRequest, MOCK_RESPONSE);
        expect(api.sendMessage).toHaveBeenCalledTimes(1);
        expect(api.sendMessage).toHaveBeenCalledWith(TEST_MESSAGE[0]);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("Post Message (error case)", async () => {
        api.sendMessage.mockResolvedValueOnce(StatusCode.FORBIDDEN);
        const mRequest = createMockRequest(TEST_MESSAGE[0]);
        await MessageProcessor.postMessage(mRequest, MOCK_RESPONSE);
        expect(api.sendMessage).toHaveBeenCalledTimes(1);
        expect(api.sendMessage).toHaveBeenCalledWith(TEST_MESSAGE[0]);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.FORBIDDEN));
    });

    it("Put Message (normal case)", async () => {
        api.editMessage.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({content: TEST_MESSAGE[0].content, date: TEST_MESSAGE[0].date}, {id: mockMessageId});
        await MessageProcessor.putMessage(mRequest, MOCK_RESPONSE);
        expect(api.editMessage).toHaveBeenCalledTimes(1);
        expect(api.editMessage).toHaveBeenCalledWith(mockMessageId, TEST_MESSAGE[0].content, TEST_MESSAGE[0].date);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("Put Message (error case)", async () => {
        api.editMessage.mockResolvedValueOnce(StatusCode.GONE);
        const mRequest = createMockRequest({content: TEST_MESSAGE[0].content, date: TEST_MESSAGE[0].date}, {id: mockMessageId});
        await MessageProcessor.putMessage(mRequest, MOCK_RESPONSE);
        expect(api.editMessage).toHaveBeenCalledTimes(1);
        expect(api.editMessage).toHaveBeenCalledWith(mockMessageId, TEST_MESSAGE[0].content, TEST_MESSAGE[0].date);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.GONE));
    });

    it("Delete Message (normal case)", async () => {
        api.deleteMessage.mockResolvedValueOnce(StatusCode.OK);
        const mRequest = createMockRequest({}, {id: mockMessageId});
        await MessageProcessor.deleteMessage(mRequest, MOCK_RESPONSE);
        expect(api.deleteMessage).toHaveBeenCalledTimes(1);
        expect(api.deleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(StatusCode.OK);
    });

    it("Delete Message (error case)", async () => {
        api.deleteMessage.mockResolvedValueOnce(StatusCode.GONE);
        const mRequest = createMockRequest({}, {id: mockMessageId});
        await MessageProcessor.deleteMessage(mRequest, MOCK_RESPONSE);
        expect(api.deleteMessage).toHaveBeenCalledTimes(1);
        expect(api.deleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(StatusCode.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(ERROR_MESSAGES.get(StatusCode.GONE));
    });
});
