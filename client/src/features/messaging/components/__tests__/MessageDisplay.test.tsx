import React from "react";
import MessageDisplay from "../MessageDisplay";
import { render, cleanup } from "@testing-library/react";

const mockUsername = "Xx_TestDummy_xX";
const mockContent = "Hi!!!";

describe("Message Display Unit Tests", () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Message Display renders string props correctly", () => {
        const { getByText } = render(<MessageDisplay username={mockUsername} content={mockContent} isAuthor={false} />);
        expect(getByText(`${mockUsername}:`)).toBeInTheDocument();
        expect(getByText(mockContent)).toBeInTheDocument();
    });

    it("Message Display renders container with items-start if received message", () => {
        const { getByTestId } = render(<MessageDisplay username={mockUsername} content={mockContent} isAuthor={false} />);
        const displayContainer = getByTestId("display-container");
        expect(displayContainer.classList.value).toContain("items-start");
    });

    it("Content renders with gray background if received message.", () => {
        const { getByTestId } = render(<MessageDisplay username={mockUsername} content={mockContent} isAuthor={false} />);
        const contentContainer = getByTestId("content-container");
        expect(contentContainer.classList.value).toContain("bg-gray-400");
    });

    it("Message Display renders container with items-end if sent message", () => {
        const { getByTestId } = render(<MessageDisplay username={mockUsername} content={mockContent} isAuthor={true} />);
        const displayContainer = getByTestId("display-container");
        expect(displayContainer.classList.value).toContain("items-end");
    });

    it("Content renders with blue background if sent message.", () => {
        const { getByTestId } = render(<MessageDisplay username={mockUsername} content={mockContent} isAuthor={true} />);
        const contentContainer = getByTestId("content-container");
        expect(contentContainer.classList.value).toContain("bg-cyan-500");
    });
});
