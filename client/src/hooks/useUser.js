import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "./useLocalStorage";

export const useUser = () => {
    const { user, setUser } = useAuth();
    const { setItem, getItem } = useLocalStorage();

    useEffect(() => {
        const currentUser = getItem("user");
        if(currentUser) {
            addUser(JSON.parse(currentUser));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addUser = (user) => {
        console.log("Adding user to local storage...");
        setUser(user);
        setItem("user", JSON.stringify(user));
        console.log(`Local storage: ${getItem("user")}`);
    }

    const removeUser = () => {
        console.log("Removing user from local storage...");
        setUser({email: "", accessToken: "", refreshToken: ""});
        setItem("user", user);
    }

    return {user, addUser, removeUser};
}
