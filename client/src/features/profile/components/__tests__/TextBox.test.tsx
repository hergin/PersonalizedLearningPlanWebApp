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
    const mockedStartCase = startCase as any;
    const mockResult = "Title Case";

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("TextBox renders correctly", () => {
        mockedStartCase.mockImplementation(() => {return mockResult});
        const { getByRole, getByText, getByTestId } = render(
            <TextBox 
                name={mockName}
                value={mockValue}
                onEnterPress={mockOnEnterPress}
                onChange={mockOnChange}
            />
        );
        expect(getByTestId("textBoxContainer").classList.toString()).toEqual("flex flex-row justify-between gap-[5px]");
        expect(() => getByText(`${mockResult}:`)).toThrow(expect.any(Error));
        expect(mockedStartCase).toHaveBeenCalledTimes(1);
        expect(mockedStartCase).toHaveBeenCalledWith(mockName);
        expect(getByRole("textbox")).toBeInTheDocument();
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
});
