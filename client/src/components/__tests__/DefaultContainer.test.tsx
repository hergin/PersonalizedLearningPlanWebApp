import React from "react";
import DefaultScreen from "../DefaultContainer";
import { render } from "@testing-library/react";
import { Outlet } from "react-router";
import NavBar from "../Navbar";

jest.mock("react-router", () => ({
    Outlet: jest.fn(),
}));
jest.mock("../Navbar");

describe("Default Screen Unit Tests", () => {
    var mockOutlet: any;
    var mockNavbar: any;

    beforeEach(() => {
        mockOutlet = Outlet;
        mockNavbar = NavBar;
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("Default Screen renders correctly", () => {
        render(<DefaultScreen />);
        expect(mockOutlet).toHaveBeenCalledTimes(1);
        expect(mockNavbar).toHaveBeenCalledTimes(1);
    });
});
