import React from "react";
import DropDownCheckbox from "../DropDownCheckbox";
import { render, fireEvent } from "@testing-library/react";

const mockCheckToggle = jest.fn();

describe("DropDownCheckbox Unit Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("DropDownCheckbox Default Case", () => {
        const { getByTestId } = render(
            <DropDownCheckbox checked={true} handleCheckToggle={mockCheckToggle}>
                Test
            </DropDownCheckbox>
        );
        expect(getByTestId("checkbox").firstChild).toBeChecked();
    });

    it("DropDownCheckbox onChange", () => {
        const { getByTestId } = render(
            <DropDownCheckbox checked={true} handleCheckToggle={mockCheckToggle}>
                Test
            </DropDownCheckbox>
        );
        const checkbox = getByTestId("checkbox");
        fireEvent.change(checkbox, {target: {checked: false}});
        expect(checkbox.firstChild).toBeChecked();
    });

    it("DropDownCheckbox renders left icon", () => {
        const { getByAltText } = render(
            <DropDownCheckbox checked={true} handleCheckToggle={mockCheckToggle} leftIcon={<img src="" alt="Test Left Icon"/>}>
                Test
            </DropDownCheckbox>
        );
        getByAltText("Test Left Icon");
    });

    it("DropDownCheckbox renders right icon", () => {
        const { getByAltText } = render(
            <DropDownCheckbox checked={true} handleCheckToggle={mockCheckToggle} rightIcon={<img src="" alt="Test Right Icon"/>}>
                Test
            </DropDownCheckbox>
        );
        getByAltText("Test Right Icon");
    });
});
