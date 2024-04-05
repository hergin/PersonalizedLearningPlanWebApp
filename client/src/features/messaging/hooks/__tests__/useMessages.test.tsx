import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMessages, useMessageCreator, useMessageEditor, useMessageRemover } from "../useMessages";
import MessagingApi from "../../api/messaging-api";
import { CreatedMessage } from "../../../../types";
import { renderHook, cleanup, waitFor } from "@testing-library/react";

const mockInvalidateQueries = jest.fn();
jest.mock("@tanstack/react-query", () => ({
    ...jest.requireActual("@tanstack/react-query"),
    __esModule: true,
    useQueryClient: () => ({
        invalidateQueries: mockInvalidateQueries
    })
}));

jest.mock("../../api/messaging-api");

const mockAccountId = 1;
const mockRecipientId = 2;
const mockMessage: CreatedMessage = {
    content: "Oh, hi!",
    sender_id: mockAccountId,
    recipientId: mockRecipientId,
};

describe("Use Messages Unit Tests", () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    var mockApi: any;

    beforeEach(() => {
        mockApi = MessagingApi();
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Use Messages", async () => {
        mockApi.getMessagesBetween.mockResolvedValueOnce([mockMessage]);
        const { result } = renderHook(() => useMessages(mockAccountId, mockRecipientId), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(0);
        expect(mockApi.getMessagesBetween).toHaveBeenCalledTimes(1);
        expect(mockApi.getMessagesBetween).toHaveBeenCalledWith(mockAccountId, mockRecipientId);
        expect(result.current.data).toEqual([mockMessage]);
    });

    it("Use Message Creator", async () => {
        mockApi.sendMessage.mockResolvedValueOnce({});
        const { mutateAsync } = renderHook(() => useMessageCreator(), { wrapper }).result.current;
        await mutateAsync(mockMessage);
        expect(mockApi.sendMessage).toHaveBeenCalledTimes(1);
        expect(mockApi.sendMessage).toHaveBeenCalledWith(mockMessage);
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["message"]});
    });

    it("Use Message Editor", async () => {
        const mockEditMessageProps = {id: 0, content: "Edited!"};
        mockApi.editMessage.mockResolvedValueOnce({});
        const { mutateAsync } = renderHook(() => useMessageEditor(), { wrapper }).result.current;
        await mutateAsync(mockEditMessageProps);
        expect(mockApi.editMessage).toHaveBeenCalledTimes(1);
        expect(mockApi.editMessage).toHaveBeenCalledWith(mockEditMessageProps.id, mockEditMessageProps.content);
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["message"]});
    });

    it("Use Message Remover", async () => {
        const mockMessageId = 0;
        mockApi.deleteMessage.mockResolvedValueOnce({});
        const { mutateAsync } = renderHook(() => useMessageRemover(), { wrapper }).result.current;
        await mutateAsync(mockMessageId);
        expect(mockApi.deleteMessage).toHaveBeenCalledTimes(1);
        expect(mockApi.deleteMessage).toHaveBeenCalledWith(mockMessageId);
        expect(mockInvalidateQueries).toHaveBeenCalledTimes(1);
        expect(mockInvalidateQueries).toHaveBeenCalledWith({queryKey: ["message"]});
    });
});
