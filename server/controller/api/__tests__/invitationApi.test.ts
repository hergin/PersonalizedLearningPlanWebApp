import InvitationApi from "../invitationApi";
import InvitationParser from "../../../parser/invitationParser";
import { STATUS_CODE } from "../../../types";
import { FAKE_ERRORS } from "../../global/mockValues";
jest.mock("../../../parser/invitationParser");

const TEST_DATA = {
    id: 50,
    senderId: 1,
    recipientId: 2,
    senderUsername: "bobjonesxx",
    recipientUsername: "tsnicholas",
    senderEmail: "example@outlook.com",
    recipientEmail: "foo@gmail.com"
}

describe("Invitation Api Unit Tests", () => {
    const invitationApi = new InvitationApi();
    let parser: any;
    
    beforeEach(() => {
        parser = new InvitationParser();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("get invites (normal case)", async () => {
        parser.getInvites.mockResolvedValueOnce([TEST_DATA]);
        const result = await invitationApi.getInvites(TEST_DATA.recipientId);
        expect(parser.getInvites).toHaveBeenCalledTimes(1);
        expect(parser.getInvites).toHaveBeenCalledWith(TEST_DATA.recipientId);
        expect(result).toEqual([TEST_DATA]);
    });

    it("get invites (error case)", async () => {
        parser.getInvites.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        const result = await invitationApi.getInvites(TEST_DATA.recipientId);
        expect(parser.getInvites).toHaveBeenCalledTimes(1);
        expect(parser.getInvites).toHaveBeenCalledWith(TEST_DATA.recipientId);
        expect(result).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });

    it("get pending invites (normal case)", async () => {
        parser.getPendingInvites.mockResolvedValueOnce([TEST_DATA]);
        const result = await invitationApi.getPendingInvites(TEST_DATA.senderId);
        expect(parser.getPendingInvites).toHaveBeenCalledTimes(1);
        expect(parser.getPendingInvites).toHaveBeenCalledWith(TEST_DATA.senderId);
        expect(result).toEqual([TEST_DATA]);
    });

    it("get pending invites (error case)", async () => {
        parser.getPendingInvites.mockRejectedValue(FAKE_ERRORS.badRequest);
        const result = await invitationApi.getPendingInvites(TEST_DATA.senderId);
        expect(parser.getPendingInvites).toHaveBeenCalledTimes(1);
        expect(parser.getPendingInvites).toHaveBeenCalledWith(TEST_DATA.senderId);
        expect(result).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it("create invite (normal case)", async () => {
        parser.createInvite.mockResolvedValueOnce();
        parser.getInviteWithAccounts.mockResolvedValueOnce([TEST_DATA])
        const result = await invitationApi.createInvite(TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(parser.createInvite).toHaveBeenCalledTimes(1);
        expect(parser.createInvite).toHaveBeenCalledWith(TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(parser.getInviteWithAccounts).toHaveBeenCalledTimes(1);
        expect(parser.getInviteWithAccounts).toHaveBeenCalledWith(TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(result).toEqual([TEST_DATA]);
    });

    it("create invite (create invite error case)", async () => {
        parser.createInvite.mockRejectedValue(FAKE_ERRORS.primaryKeyViolation);
        const result = await invitationApi.createInvite(TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(parser.createInvite).toHaveBeenCalledTimes(1);
        expect(parser.createInvite).toHaveBeenCalledWith(TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(parser.getInviteWithAccounts).toHaveBeenCalledTimes(0);
        expect(result).toEqual(STATUS_CODE.CONFLICT);
    });

    it("create invite (get invite with accounts error case)", async () => {
        parser.createInvite.mockResolvedValueOnce();
        parser.getInviteWithAccounts.mockRejectedValue(FAKE_ERRORS.networkError);
        const result = await invitationApi.createInvite(TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(parser.createInvite).toHaveBeenCalledTimes(1);
        expect(parser.createInvite).toHaveBeenCalledWith(TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(parser.getInviteWithAccounts).toHaveBeenCalledTimes(1);
        expect(parser.getInviteWithAccounts).toHaveBeenCalledWith(TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(result).toEqual(STATUS_CODE.CONNECTION_ERROR);
    });

    it("accept invite (normal case)", async () => {
        parser.acceptInvite.mockResolvedValueOnce([TEST_DATA]);
        const result = await invitationApi.acceptInvite(TEST_DATA.id, TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(parser.acceptInvite).toHaveBeenCalledTimes(1);
        expect(parser.acceptInvite).toHaveBeenCalledWith(TEST_DATA.id, TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(result).toEqual([TEST_DATA]);
    });

    it("accept invite (error case)", async () => {
        parser.acceptInvite.mockRejectedValue(FAKE_ERRORS.badRequest);
        const result = await invitationApi.acceptInvite(TEST_DATA.id, TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(parser.acceptInvite).toHaveBeenCalledTimes(1);
        expect(parser.acceptInvite).toHaveBeenCalledWith(TEST_DATA.id, TEST_DATA.senderId, TEST_DATA.recipientId);
        expect(result).toEqual(STATUS_CODE.BAD_REQUEST);
    });

    it("reject invite (normal case)", async () => {
        parser.deleteInvite.mockResolvedValueOnce([TEST_DATA]);
        const result = await invitationApi.rejectInvite(TEST_DATA.id);
        expect(parser.deleteInvite).toHaveBeenCalledTimes(1);
        expect(parser.deleteInvite).toHaveBeenCalledWith(TEST_DATA.id);
        expect(result).toEqual([TEST_DATA]);
    });

    it("reject invite (error case)", async () => {
        parser.deleteInvite.mockRejectedValue(FAKE_ERRORS.fatalServerError);
        const result = await invitationApi.rejectInvite(TEST_DATA.id);
        expect(parser.deleteInvite).toHaveBeenCalledTimes(1);
        expect(parser.deleteInvite).toHaveBeenCalledWith(TEST_DATA.id);
        expect(result).toEqual(STATUS_CODE.INTERNAL_SERVER_ERROR);
    });
});
