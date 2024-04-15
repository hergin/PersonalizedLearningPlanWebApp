import React, { ReactElement, PropsWithChildren } from "react";
import ChatScreen from "../ChatScreen";
import { render, cleanup } from "@testing-library/react";
import { useMessages } from "../../hooks/useMessages";
import { Message } from "../../../../types";
import { useParams } from "react-router-dom";

jest.mock("../../hooks/useMessages");
jest.mock("../MessageDisplay", () => ({
    __esModule: true,
    default: ({children}: PropsWithChildren): ReactElement => {
        return (<div data-testid="mock-message-display">{children}</div>);
    }
}));
jest.mock("../MessageInput", () => ({
    __esModule: true,
    default: (): ReactElement => {
        return (<div data-testid="mock-message-input"></div>);
    }
}));
jest.mock("react-router-dom", () => ({
    useParams: jest.fn(),
}));

const mockUser = {id: 0};
jest.mock("../../../../context/AuthContext", () => ({
    useAuth: () => ({
        user: mockUser,
    }),
}));

const mockRecipientId = 1;
const mockUsernames = [
    "Xx_TestDummy_xX",
    "WaifuMaster1"
];
const mockDates = [
    "2024-04-05 15:51:28.357242-04",
    "2024-04-05 15:51:28.357242-04"
];

const mockMessages = [
    {
        id: 0,
        content: "Hi, how are you?",
        sender_id: mockUser.id,
        recipient_id: mockRecipientId,
        username: mockUsernames[0],
        date: mockDates[0],
    },
    {
        id: 1,
        content: "I'm doing pretty well, how about you?",
        sender_id: mockRecipientId,
        recipient_id: mockUser.id,
        username: mockUsernames[1],
        date: mockDates[1],
    }
];

describe("Chat Unit Tests", () => {
    var mockUseParams: jest.Mock<any, any, any>;
    var mockUseMessages: jest.Mock<any, any, any>;

    beforeEach(() => {
        mockUseParams = useParams as jest.Mock;
        mockUseParams.mockReturnValue({id: mockRecipientId});
        mockUseMessages = useMessages as jest.Mock;
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Renders normally.", () => {
        mockUseMessages.mockReturnValue({
            data: mockMessages,
            isLoading: false,
            error: false
        });
        const { getAllByTestId } = render(<ChatScreen />);
        expect(getAllByTestId("mock-message-display").length).toEqual(2);
    });

    it("Renders when loading.", () => {
        mockUseMessages.mockReturnValue({
            data: undefined,
            isLoading: true,
            error: true,
        });
        const { getByText } = render(<ChatScreen />);
        expect(getByText("Loading, please wait...")).toBeInTheDocument();
    });

    it("Renders after error occurs", () => {
        mockUseMessages.mockReturnValue({
            data: undefined,
            isLoading: false,
            error: true,
        });
        const { getByText } = render(<ChatScreen />);
        expect(getByText("An error occurred! Please try again!")).toBeInTheDocument();
    });
});
