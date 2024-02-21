import React, { createContext, useContext, useState, PropsWithChildren } from "react";
import { User, emptyUser } from "../types";

interface AuthContextProps {
    user: User,
    setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextProps>({user: emptyUser, setUser: (user: User) => {console.log(user)}});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}: PropsWithChildren) {
    const [user, setUser] = useState<User>(() => {
        const savedUser = sessionStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : emptyUser;
    });

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
}
