import React from "react";
import TextBox from "../TextBox";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { startCase } from "lodash";

jest.mock("lodash", () => ({
    startCase: jest.fn()
}));

const mockName = "bill";
const mockValue = "nothing";
const mockOnEnterPress = jest.fn();
const mockOnChange = jest.fn();

describe("TextBox Unit Tests", () => {
    // This allows startCase to be used as a jest.fn() without a compiling error 
    // since the compiler doesn't know it's mocked until it's actually ran.
    const mockedStartCase = startCase as any;
    const mockResult = "Title Case";

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("TextBox renders normally", () => {
        mockedStartCase.mockImplementation(() => {return mockResult});
        const { getByRole, getByTestId, getByText } = render(
            <TextBox 
                name={mockName}
                value={mockValue}
                onEnterPress={mockOnEnterPress}
                onChange={mockOnChange}
            />
        );
        expect(getByTestId("textBoxContainer").classList.toString()).toEqual("flex flex-row mx-5 my-1");
        expect(mockedStartCase).toHaveBeenCalledTimes(1);
        expect(mockedStartCase).toHaveBeenCalledWith(mockName);
        const textbox = getByRole("textbox");
        expect(() => getByText(`Please enter your ${mockResult.toLowerCase()}.`)).toThrow(expect.any(Error));
        expect(textbox.getAttribute("required")).toBeNull();
        expect(textbox.getAttribute("maxLength")).toEqual("50");
    });

    it("TextBox triggers onEnterPress during keyboard event", () => {
        mockedStartCase.mockImplementation(() => {return mockResult});
        const { getByRole } = render(
            <TextBox 
                name={mockName}
                value={mockValue}
                onEnterPress={mockOnEnterPress}
                onChange={mockOnChange}
            />
        );
        const input = getByRole("textbox");
        fireEvent.keyUp(input, {key: "Enter"});
        expect(mockOnEnterPress).toHaveBeenCalledTimes(1);
    });

    it("TextBox triggers onChange when value changes", () => {
        mockedStartCase.mockImplementation(() => {return mockResult});
        const { getByRole } = render(
            <TextBox 
                name={mockName}
                value={mockValue}
                onEnterPress={mockOnEnterPress}
                onChange={mockOnChange}
            />
        );
        const input = getByRole("textbox");
        fireEvent.change(input, {target: {value: "changed"}});
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("TextBox displays an error for users who leave required fields blank.", () => {
        mockedStartCase.mockImplementation(() => {return mockResult});
        const { getByRole, getByText } = render(
            <TextBox
                name={mockName}
                value={""}
                onEnterPress={mockOnEnterPress}
                onChange={mockOnChange}
                required
            />
        );
        const textbox = getByRole("textbox");
        expect(textbox.getAttribute("required")).toEqual("");
        expect(getByText(`Please enter your ${mockResult.toLowerCase()}.`)).toBeInTheDocument();
    });

    it("Textbox can render isTextArea correctly", () => {
        const { getByRole } = render(
            <TextBox
                name={mockName}
                value={mockValue}
                onEnterPress={mockOnEnterPress}
                onChange={mockOnChange}
                isTextArea
            />
        );
        const textbox = getByRole("textbox");
        expect(textbox.getAttribute("maxLength")).toEqual("500");
        expect(textbox.classList.contains("MuiInputBase-inputMultiline")).toBe(true);
    });
});
