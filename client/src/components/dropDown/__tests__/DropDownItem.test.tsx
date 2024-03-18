import React from "react";
import DropDownItem from "../DropDownItem";
import { render, fireEvent } from "@testing-library/react";

describe("DropDownItem Unit Tests", () => {
    it("DropDownItem Default Render", () => {
        const { getByTestId } = render(
            <DropDownItem>
                Test Item
            </DropDownItem>
        );
        const container = getByTestId("itemContainer");
        expect(container.childNodes.length).toEqual(1);
        expect(container.textContent).toEqual("Test Item");
    });

    it("DropDownItem renders with onClick Event", () => {
        const mockOnClick = jest.fn();
        const { getByTestId } = render(
            <DropDownItem onClick={mockOnClick}>
                Test Item
            </DropDownItem>
        );
        const container = getByTestId("itemContainer");
        expect(container.childNodes.length).toEqual(1);
        expect(container.textContent).toEqual("Test Item");
        fireEvent.click(container);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("DropDownItem renders with left Icon", () => {
        const { getByAltText, getByTestId } = render(
            <DropDownItem leftIcon={(<img src="" alt="leftIcon" />)}>
                Test Item
            </DropDownItem>
        );
        const leftIcon = getByAltText("leftIcon");
        expect(leftIcon).toBeDefined();
        const container = getByTestId("itemContainer");
        expect(container.childNodes.length).toEqual(2);
        expect(container.textContent).toEqual("Test Item");
    });

    it("DropDownItem renders with right Icon", () => {
        const { getByAltText, getByTestId } = render(
            <DropDownItem rightIcon={(<img src="" alt="rightIcon" />)}>
                Test Item
            </DropDownItem>
        );
        const rightIcon = getByAltText("rightIcon");
        expect(rightIcon).toBeDefined();
        const container = getByTestId("itemContainer");
        expect(container.childNodes.length).toEqual(2);
        expect(container.textContent).toEqual("Test Item");
    });

    it("DropDownItem renders with both icons", () => {
        const { getByAltText, getByTestId } = render(
            <DropDownItem leftIcon={(<img src="" alt="leftIcon" />)} rightIcon={(<img src="" alt="rightIcon" />)}>
                Test Item
            </DropDownItem>
        );
        const leftIcon = getByAltText("leftIcon");
        expect(leftIcon).toBeDefined();
        const rightIcon = getByAltText("rightIcon");
        expect(rightIcon).toBeDefined();
        const container = getByTestId("itemContainer");
        expect(container.childNodes.length).toEqual(3);
        expect(container.textContent).toEqual("Test Item");
    });

    it("DropDownItem renders with all props", () => {
        const mockOnClick = jest.fn();
        const { getByAltText, getByTestId } = render(
            <DropDownItem onClick={mockOnClick} leftIcon={(<img src="" alt="leftIcon" />)} rightIcon={(<img src="" alt="rightIcon" />)}>
                Test Item
            </DropDownItem>
        );
        const leftIcon = getByAltText("leftIcon");
        expect(leftIcon).toBeDefined();
        const rightIcon = getByAltText("rightIcon");
        expect(rightIcon).toBeDefined();
        const container = getByTestId("itemContainer");
        fireEvent.click(container);
        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(container.childNodes.length).toEqual(3);
        expect(container.textContent).toEqual("Test Item");
    });
});
