import React from "react";
import { emptyUser } from "../../types";
import AccountButton from "../AccountButton";
import AccountMenu from "../AccountMenu";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AccountButton />} />
                    <Route path="/login" element={<TestComponent />} />
                </Routes>
            </BrowserRouter>
        );
        expect(() => getByTestId("profilePictureMenu")).toThrow(expect.any(Error));
        const button = getByTestId("loginButton");
        expect(button.classList.toString()).toEqual("hover:bg-[#820000] cursor-pointer duration-500 flex flex-col justify-center items-center w-full no-underline text-2xl h-12 bg-transparent font-headlineFont border-none px-4");
        expect(button).toHaveTextContent("Login/Register");
        const link = getByTestId("loginLink");
        fireEvent.click(link);
        expect(window.location.pathname).toEqual("/login");
    });
});

function TestComponent() {
    return (<></>);
}
