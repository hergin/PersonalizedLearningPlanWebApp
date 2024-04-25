import * as InvitationProcessor from "../invitationProcessor";
import InvitationApi from "../../api/invitationApi";
import EmailService from "../../../service/emailService";
import { STATUS_CODE, SUBJECTS } from "../../../types";
import { getLoginError } from "../../../utils/errorHandlers";
import { createMockRequest, MOCK_RESPONSE, TEST_INVITE } from "../../global/mockValues";

jest.mock("../../../controller/api/invitationApi");
jest.mock("../../../service/emailService");

describe("Invitation Processor Unit Tests", () => {
    let invitationApi: any;
    let emailService: any;

    beforeEach(() => {
        invitationApi = new InvitationApi();
        emailService = new EmailService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get invites (normal case)", async () => {
        invitationApi.getInvites.mockResolvedValueOnce([TEST_INVITE]);
        const mRequest = createMockRequest({}, {id: TEST_INVITE.recipient_id});
        await InvitationProcessor.getInvites(mRequest, MOCK_RESPONSE);
        expect(invitationApi.getInvites).toHaveBeenCalledTimes(1);
        expect(invitationApi.getInvites).toHaveBeenCalledWith(TEST_INVITE.recipient_id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_INVITE]);
    });

    it("get invites (error case)", async () => {
        invitationApi.getInvites.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        const mRequest = createMockRequest({}, {id: TEST_INVITE.recipient_id});
        await InvitationProcessor.getInvites(mRequest, MOCK_RESPONSE);
        expect(invitationApi.getInvites).toHaveBeenCalledTimes(1);
        expect(invitationApi.getInvites).toHaveBeenCalledWith(TEST_INVITE.recipient_id);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.BAD_REQUEST));
    });

    it("get pending invites (normal case)", async () => {
        invitationApi.getPendingInvites.mockResolvedValueOnce([TEST_INVITE]);
        const mRequest = createMockRequest({}, {id: TEST_INVITE.sender_id});
        await InvitationProcessor.getPendingInvites(mRequest, MOCK_RESPONSE);
        expect(invitationApi.getPendingInvites).toHaveBeenCalledTimes(1);
        expect(invitationApi.getPendingInvites).toHaveBeenCalledWith(TEST_INVITE.sender_id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledWith([TEST_INVITE]);
    });

    it("get pending invites (error case)", async () => {
        invitationApi.getPendingInvites.mockResolvedValueOnce(STATUS_CODE.CONFLICT);
        const mRequest = createMockRequest({}, {id: TEST_INVITE.sender_id});
        await InvitationProcessor.getPendingInvites(mRequest, MOCK_RESPONSE);
        expect(invitationApi.getPendingInvites).toHaveBeenCalledTimes(1);
        expect(invitationApi.getPendingInvites).toHaveBeenCalledWith(TEST_INVITE.sender_id);
        expect(MOCK_RESPONSE.json).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.CONFLICT));
    });

    it("post invite (normal case)", async () => {
        invitationApi.createInvite.mockResolvedValueOnce([TEST_INVITE]);
        emailService.sendInviteEmail.mockResolvedValueOnce();
        const mRequest = createMockRequest({senderId: TEST_INVITE.sender_id, recipientId: TEST_INVITE.recipient_id});
        await InvitationProcessor.postInvite(mRequest, MOCK_RESPONSE);
        expect(invitationApi.createInvite).toHaveBeenCalledTimes(1);
        expect(invitationApi.createInvite).toHaveBeenCalledWith(TEST_INVITE.sender_id, TEST_INVITE.recipient_id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(emailService.sendInviteEmail).toHaveBeenCalledTimes(1);
        expect(emailService.sendInviteEmail).toHaveBeenCalledWith(TEST_INVITE, SUBJECTS.INVITATION);
    });

    it("post invite (error case)", async () => {
        invitationApi.createInvite.mockResolvedValueOnce(STATUS_CODE.FORBIDDEN);
        const mRequest = createMockRequest({senderId: TEST_INVITE.sender_id, recipientId: TEST_INVITE.recipient_id});
        await InvitationProcessor.postInvite(mRequest, MOCK_RESPONSE);
        expect(invitationApi.createInvite).toHaveBeenCalledTimes(1);
        expect(invitationApi.createInvite).toHaveBeenCalledWith(TEST_INVITE.sender_id, TEST_INVITE.recipient_id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.FORBIDDEN);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.FORBIDDEN));
        expect(emailService.sendInviteEmail).toHaveBeenCalledTimes(0);
    });

    it("accept invite (normal case)", async () => {
        invitationApi.acceptInvite.mockResolvedValueOnce([TEST_INVITE]);
        emailService.sendInviteEmail.mockResolvedValueOnce();
        const mRequest = createMockRequest({senderId: TEST_INVITE.sender_id, recipientId: TEST_INVITE.recipient_id}, {id: TEST_INVITE.id});
        await InvitationProcessor.acceptInvite(mRequest, MOCK_RESPONSE);
        expect(invitationApi.acceptInvite).toHaveBeenCalledTimes(1);
        expect(invitationApi.acceptInvite).toHaveBeenCalledWith(TEST_INVITE.id, TEST_INVITE.sender_id, TEST_INVITE.recipient_id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(emailService.sendInviteEmail).toHaveBeenCalledTimes(1);
        expect(emailService.sendInviteEmail).toHaveBeenCalledWith(TEST_INVITE, SUBJECTS.ACCEPTED);
    });

    it("accept invite (error case)", async () => {
        invitationApi.acceptInvite.mockResolvedValueOnce(STATUS_CODE.BAD_REQUEST);
        emailService.sendInviteEmail.mockResolvedValueOnce();
        const mRequest = createMockRequest({senderId: TEST_INVITE.sender_id, recipientId: TEST_INVITE.recipient_id}, {id: TEST_INVITE.id});
        await InvitationProcessor.acceptInvite(mRequest, MOCK_RESPONSE);
        expect(invitationApi.acceptInvite).toHaveBeenCalledTimes(1);
        expect(invitationApi.acceptInvite).toHaveBeenCalledWith(TEST_INVITE.id, TEST_INVITE.sender_id, TEST_INVITE.recipient_id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.BAD_REQUEST));
        expect(emailService.sendInviteEmail).toHaveBeenCalledTimes(0);
    });

    it("reject invite (normal case)", async () => {
        invitationApi.rejectInvite.mockResolvedValueOnce([TEST_INVITE]);
        emailService.sendInviteEmail.mockResolvedValueOnce();
        const mRequest = createMockRequest({}, {id: TEST_INVITE.id});
        await InvitationProcessor.rejectInvite(mRequest, MOCK_RESPONSE);
        expect(invitationApi.rejectInvite).toHaveBeenCalledTimes(1);
        expect(invitationApi.rejectInvite).toHaveBeenCalledWith(TEST_INVITE.id);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledWith(STATUS_CODE.OK);
        expect(emailService.sendInviteEmail).toHaveBeenCalledTimes(1);
        expect(emailService.sendInviteEmail).toHaveBeenCalledWith(TEST_INVITE, SUBJECTS.REJECTED);
    });

    it("reject invite (error case)", async () => {
        invitationApi.rejectInvite.mockResolvedValueOnce(STATUS_CODE.GONE);
        const mRequest = createMockRequest({}, {id: TEST_INVITE.id});
        await InvitationProcessor.rejectInvite(mRequest, MOCK_RESPONSE);
        expect(invitationApi.rejectInvite).toHaveBeenCalledTimes(1);
        expect(invitationApi.rejectInvite).toHaveBeenCalledWith(TEST_INVITE.id);
        expect(MOCK_RESPONSE.sendStatus).toHaveBeenCalledTimes(0);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.status).toHaveBeenCalledWith(STATUS_CODE.GONE);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledTimes(1);
        expect(MOCK_RESPONSE.send).toHaveBeenCalledWith(getLoginError(STATUS_CODE.GONE));
        expect(emailService.sendInviteEmail).toHaveBeenCalledTimes(0);
    });
});
