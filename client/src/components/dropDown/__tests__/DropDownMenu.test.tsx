import React from "react";
import DropDownMenu from "../DropDownMenu";
import { render } from "@testing-library/react";

const STATIC_STYLE = "border-[0.8px] border-solid border-[rgb(219, 219, 219)] p-[1rem] bg-element-base overflow-hidden font-headlineFont ";
const ADDITIONAL_STYLING = "absolute top-[58px] w-[190px] translate-x-[-45%] translate-y-[20px]";
const TEXT_CONTENT = "This is a Drop Down Menu.";

describe("DropDownMenu Unit Tests", () => {
    it("Drop Down Menu renders correctly without additional styling", () => {
        const { getByTestId } = render(
            <DropDownMenu>{TEXT_CONTENT}</DropDownMenu>
        );
        const container = getByTestId("container");
        expect(container.classList.toString()).toEqual(STATIC_STYLE);
        expect(container.textContent).toEqual(TEXT_CONTENT);
    });

    it("Drop Down Menu renders correctly with additional styling", () => {
        const { getByTestId } = render(
            <DropDownMenu style={ADDITIONAL_STYLING}>{TEXT_CONTENT}</DropDownMenu>
        );
        const container = getByTestId("container");
        expect(container.classList.toString()).toEqual(`${STATIC_STYLE}${ADDITIONAL_STYLING}`);
        expect(container.textContent).toEqual(TEXT_CONTENT);
    });
});
