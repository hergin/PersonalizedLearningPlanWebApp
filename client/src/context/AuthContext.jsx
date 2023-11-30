import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [user, setUser] = useState({email: "", accessToken: "", refreshToken: ""});
    console.log(`Context: ${user.email} ${user.accessToken} ${user.refreshToken}`);

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
}
