import React, { ReactElement, PropsWithChildren } from "react";

export const useAuth = () => ({
    user: {},
    setUser: jest.fn(),
});

export const AuthProvider = jest.fn().mockImplementation(({children}: PropsWithChildren): ReactElement => {
    return (<>{children}</>);
});
