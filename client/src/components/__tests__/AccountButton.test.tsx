import React from "react";
import { emptyUser } from "../../types";
import AccountButton from "../AccountButton";
import AccountMenu from "../AccountMenu";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Link, Routes } from "react-router-dom";

var mockUser = emptyUser;
jest.mock("../../context/AuthContext", () => ({
    useAuth: () => ({
        user: mockUser,
    }),
}));
jest.mock("../ProfilePicture");
jest.mock("../AccountMenu");

describe("Account Button Unit Tests", () => {
    var mockMenu: any;
    
    beforeEach(() => {
        mockMenu = AccountMenu;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("Logged out case.", () => {
        const { getByTestId } = render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<AccountButton />} />
                </Routes>
            </MemoryRouter>
        );
        expect(() => getByTestId("profilePictureMenu")).toThrow(expect.any(Error));
        const button = getByTestId("loginButton");
        expect(button.classList.toString()).toEqual("hover:bg-[#820000] cursor-pointer duration-500 flex flex-col justify-center items-center w-full no-underline text-2xl h-12 bg-transparent font-headlineFont border-none px-4");
        expect(button).toHaveTextContent("Login/Register");
        expect(getByTestId("loginLink")).toHaveProperty("href", "http://localhost/login");
    });

    it("Logged in case.", () => {
        mockUser = {id: 1, accessToken: "Access Token", refreshToken: "Refresh Token"};
        const { getByTestId } = render(
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<AccountButton />} />
                </Routes>
            </MemoryRouter>
        );
        expect(() => getByTestId("loginButtonContainer")).toThrow(expect.any(Error));
        expect(getByTestId("profilePictureMenu")).toBeInTheDocument();
        expect(getByTestId("caretDown")).toBeInTheDocument();
        expect(() => getByTestId("caretUp")).toThrow(expect.any(Error));
    });
});
