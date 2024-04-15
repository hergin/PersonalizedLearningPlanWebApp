import React from "react";
import AccountMenu from "../AccountMenu";
import { render } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { User, defaultSettings, Role } from "../../types";
import { useLogoutService } from "../../features/login/hooks/useAccountServices";

var mockData: object | null = null;
var mockIsLoading = true;
var mockError = false;
const mockMutate = jest.fn();
jest.mock("../../hooks/useSettings", () => ({
    useSettings: () => ({
        data: mockData,
        isLoading: mockIsLoading,
        error: mockError,
    }),
    useSettingsMutation: () => ({
        mutateAsync: mockMutate,
    }),
}));
jest.mock("../../features/login/hooks/useAccountServices");

const mockUser: User = {id: 1, role: "basic", accessToken: "Access Token", refreshToken: "Refresh Token"};

describe("AccountMenu Unit Tests", () => {
    const elementIds = ["loadingText", "errorText"];
    var logoutHook: any;

    beforeEach(() => {
        logoutHook = useLogoutService().mutateAsync;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("AccountMenu isLoading case.", () => {
        mockIsLoading = true;
        mockError = false;
        const { getByText } = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AccountMenu user={mockUser} />} />
                    <Route path="/#" element={<TestComponent />} />
                </Routes>
            </BrowserRouter>
        );
        expect(getByText("Loading...")).toBeInTheDocument();
    });

    it("AccountMenu error case.", async () => {
        mockIsLoading = false;
        mockError = true;
        const { getByText  } = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AccountMenu user={mockUser} />} />
                    <Route path="/#" element={<TestComponent />} />
                </Routes>
            </BrowserRouter>
        );
        expect(getByText("An error has occurred!")).toBeInTheDocument();
    });

    it("AccountMenu dropDownMenu is ready.", () => {
        mockData = [{receive_emails: defaultSettings.receiveEmails, allow_coach_invitations: defaultSettings.allowCoachInvitations}];
        mockIsLoading = false;
        mockError = false;
        const { getByTestId, getByText } = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AccountMenu user={mockUser} />} />
                    <Route path="/#" element={<TestComponent />} />
                </Routes>
            </BrowserRouter>
        );
        expect(() => getByTestId(elementIds[0])).toThrow(expect.any(Error));
        expect(() => getByTestId(elementIds[1])).toThrow(expect.any(Error));
        expect(getByText("Settings")).toBeInTheDocument();
        expect(getByText("Logout")).toBeInTheDocument();
    });
});

function TestComponent() {
    return (<></>);
}
