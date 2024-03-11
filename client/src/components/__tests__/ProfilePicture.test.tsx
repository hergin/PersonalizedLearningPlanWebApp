import React from "react";
import { render } from "@testing-library/react";
import ProfilePicture from "../ProfilePicture";
import Default from "../../assets/Default_Profile_Picture.jpg";

describe("Profile Picture Unit Tests", () => {
    it("Default Render Case", () => {
        const { getByRole } = render(<ProfilePicture />);
        const image = getByRole("img");
        expect(image.classList.value).toEqual("size-14 rounded-full");
        expect(image).toHaveAttribute("src", Default);
    });

    it("Different Style Render", () => {
        const { getByRole } = render(<ProfilePicture style={"size-7"} />);
        const image = getByRole("img");
        expect(image.classList.value).toEqual("size-7 rounded-full");
        expect(image).toHaveAttribute("src", Default);
    });

    it("Different pfp Render", () => {
        const { getByRole } = render(<ProfilePicture source={"https://www.w3schools.com/howto/img_avatar.png"} />);
        const image = getByRole("img");
        expect(image.classList.value).toEqual("size-14 rounded-full");
        expect(image).toHaveAttribute("src", "https://www.w3schools.com/howto/img_avatar.png");
    });
});
