import React from "react";
import MessageInput from "../MessageInput";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { useMessageCreator } from "../../hooks/useMessages";
import { CreatedMessage } from "../../../../types";

jest.mock("../../hooks/useMessages");

const mockAccountId = 0;
const mockRecipientId = 1;

const mockMessage: CreatedMessage = {
    content: "Hi, how are you?",
    sender_id: mockAccountId,
    recipient_id: mockRecipientId,
};

describe("Message Input Unit Tests", () => {
    var mockMutate: jest.Mock<any, any, any>;

    beforeEach(() => {
        mockMutate = useMessageCreator().mutateAsync as jest.Mock;
    });
    
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Renders normally.", () => {
        const { getByTestId, getByText } = render(<MessageInput userId={mockAccountId} recipientId={mockRecipientId} />);
        expect(getByTestId("message-input")).toBeInTheDocument();
        expect(getByText("Send")).toBeInTheDocument();
    });

    it("Fires Send Message Event after pressing send button", () => {
        mockMutate.mockResolvedValueOnce({});
        const { getByText } = render(<MessageInput userId={mockAccountId} recipientId={mockRecipientId} />);
        const sendButton = getByText("Send");
        fireEvent.click(sendButton);
        expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    it("Fires Send Message Event after hitting enter key", () => {
        const enterKey = {key: "Enter"};
        mockMutate.mockResolvedValueOnce({});
        const { getByTestId } = render(<MessageInput userId={mockAccountId} recipientId={mockRecipientId} />);
        fireEvent.keyUp(getByTestId("message-input"), enterKey);
        expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    it("Doesn't fire send message event after hitting any other key", () => {
        const mockKey = {key: "Alt"};
        const { getByTestId } = render(<MessageInput userId={mockAccountId} recipientId={mockRecipientId} />);
        fireEvent.keyUp(getByTestId("message-input"), mockKey);
        expect(mockMutate).toHaveBeenCalledTimes(0);
    });
});
