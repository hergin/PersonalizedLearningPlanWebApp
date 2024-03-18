import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { render } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";
import { emptyUser } from "../../types";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
        pathname: "/LearningPlan"
    }),
    Navigate: jest.fn(),
    Outlet: jest.fn()
}));

var mockUser = {};
jest.mock("../../features/login/hooks/useUser", () => ({
    useUser: () => ({
        user: mockUser,
    })
}));

describe("Protected Route Unit Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("Protected Route (Normal Case)", async () => {
        mockUser = {id: 1, accessToken: "Access Token", refreshToken: "Refresh Token"};
        render(<ProtectedRoute />);
        expect(Navigate).toHaveBeenCalledTimes(0);
        expect(Outlet).toHaveBeenCalledTimes(1);
    });

    it("Protected Route (Empty User Case)", async () => {
        mockUser = emptyUser;
        render(<ProtectedRoute />);
        expect(Outlet).toHaveBeenCalledTimes(0);
        expect(Navigate).toHaveBeenCalledTimes(1);
        expect(Navigate).toHaveBeenCalledWith({
            to: "/login",
            replace: true,
            state: {
                from: {
                    pathname: "/LearningPlan"
                }
            },
        }, {});
    });
});
