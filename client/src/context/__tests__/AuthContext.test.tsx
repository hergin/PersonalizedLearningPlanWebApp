import React from "react";
import { render } from "@testing-library/react";
import { AuthProvider, useAuth } from "../AuthContext";

const TestComponent = () => {
    const { user } = useAuth();
    return (
        <>
            <p data-testid="id">{user?.id}</p>
            <p data-testid="accessToken">{user?.accessToken}</p>
            <p data-testid="refreshToken">{user?.refreshToken}</p>
        </>
    )
}

describe("AuthContext Unit Tests", () => {
    it("Auth Provider no user in session storage", () => {
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        const id = getByTestId("id");
        const accessToken = getByTestId("accessToken");
        const refreshToken = getByTestId("refreshToken");
        expect(id.textContent).toEqual("-1");
        expect(accessToken.textContent).toEqual("");
        expect(refreshToken.textContent).toEqual("");
    });

    it("Auth Provider saved user in session storage", () => {
        sessionStorage.setItem("user", JSON.stringify({id: 1, accessToken: "Access Token", refreshToken: "Refresh Token"}));
        const { getByTestId } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(getByTestId("id").textContent).toEqual("1");
        expect(getByTestId("accessToken").textContent).toEqual("Access Token");
        expect(getByTestId("refreshToken").textContent).toEqual("Refresh Token");
        sessionStorage.removeItem("user");
    });
});
