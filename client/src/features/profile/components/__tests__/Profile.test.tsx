import React from "react";
import { render } from "@testing-library/react";
import ProfileScreen from "../Profile";
import { BrowserRouter, Routes, Route } from "react-router-dom";

jest.mock("../../../../components/ProfilePicture");
jest.mock("../TextBox");
jest.mock("../../../../hooks/useHotKeys");
jest.mock("../../../login/hooks/useUser");
jest.mock("../../../login/hooks/useAccountServices");
jest.mock("../../hooks/useProfile");
jest.mock("lodash");

describe("Profile Screen Unit Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Profile renders", () => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<ProfileScreen />} />
                </Routes>
            </BrowserRouter>
        );
    });
});
