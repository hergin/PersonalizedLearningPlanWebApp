import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { emptyUser, User } from "../../../types";

export const useUser = () => {
    const { user, setUser } = useAuth();
    const { setItem, getItem, removeItem } = useSessionStorage();

    useEffect(() => {
        const currentUser = getItem("user");
        console.log(currentUser);
        if(currentUser) {
            addUser(JSON.parse(currentUser));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addUser = (user : User) => {
        setUser(user);
        setItem("user", JSON.stringify(user));
    }

    const replaceToken = (accessToken : string) => {
        setUser({id: user.id, accessToken, refreshToken: user.refreshToken});
        setItem("user", JSON.stringify(user));
    }

    const removeUser = () => {
        setUser(emptyUser);
        removeItem("user");
    }

    return {user, addUser, replaceToken, removeUser};
}
