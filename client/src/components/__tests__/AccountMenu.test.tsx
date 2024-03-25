import React from "react";
import AccountMenu from "../AccountMenu";
import { render } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { User, defaultSettings } from "../../types";
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

const mockUser: User = {id: 1, accessToken: "Access Token", refreshToken: "Refresh Token"};

describe("AccountMenu Unit Tests", () => {
    const elementIds = ["loadingText", "errorText", "dropDownContainer", "itemContainer"];
    var logoutHook: any;

    beforeEach(() => {
        logoutHook = useLogoutService().mutateAsync;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("AccountMenu isLoading case.", () => {
        const { getByTestId } = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AccountMenu user={mockUser} />} />
                    <Route path="/#" element={<TestComponent />} />
                </Routes>
            </BrowserRouter>
        );
        expect(() => getByTestId(elementIds[1])).toThrow(expect.any(Error));
        expect(() => getByTestId(elementIds[2])).toThrow(expect.any(Error));
        expect(getByTestId(elementIds[0])).toHaveTextContent("Loading...");
        const logoutButton = getByTestId(elementIds[3]);
        expect(logoutButton).toHaveTextContent("Logout");
    });

    it("AccountMenu error case.", async () => {
        mockIsLoading = false;
        mockError = true;
        const { getByTestId } = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AccountMenu user={mockUser} />} />
                    <Route path="/#" element={<TestComponent />} />
                </Routes>
            </BrowserRouter>
        );
        expect(() => getByTestId(elementIds[0])).toThrow(expect.any(Error));
        expect(() => getByTestId(elementIds[2])).toThrow(expect.any(Error));
        expect(getByTestId(elementIds[1])).toHaveTextContent("An error has occurred!");
        const logoutButton = getByTestId(elementIds[3]);
        expect(logoutButton).toHaveTextContent("Logout");
    });

    it("AccountMenu dropDownMenu is ready.", () => {
        mockData = [{receive_emails: defaultSettings.receiveEmails, allow_coach_invitations: defaultSettings.allowCoachInvitations}];
        mockIsLoading = false;
        mockError = false;
        const { mutateAsync } = logoutHook;
        const { getByTestId } = render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AccountMenu user={mockUser} />} />
                    <Route path="/#" element={<TestComponent />} />
                </Routes>
            </BrowserRouter>
        );
        expect(() => getByTestId(elementIds[0])).toThrow(expect.any(Error));
        expect(() => getByTestId(elementIds[1])).toThrow(expect.any(Error));
        const checkboxes = getByTestId(elementIds[2]).childNodes;
        expect(checkboxes.item(0)).toHaveTextContent("Receives Email");
        expect(checkboxes.item(1)).toHaveTextContent("Allow Invites");
        const logoutButton = getByTestId(elementIds[3]);
        expect(logoutButton).toHaveTextContent("Logout");
    });
});

function TestComponent() {
    return (<></>);
}
