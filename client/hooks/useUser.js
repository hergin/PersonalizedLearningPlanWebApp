import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "./useLocalStorage";

const useUser = () => {
    const { user, setUser } = useAuth();
    const { setItem, getItem } = useLocalStorage();

    useEffect(() => {
        const user = getItem("user");
        if(user) {
            addUser(JSON.parse(user));
        }
    }, []);

    const addUser = (user) => {
        setUser(user);
        setItem("user", JSON.stringify(user));
    }

    const removeUser = () => {
        setUser(null);
        setItem("user", "");
    }

    return {user, addUser, removeUser};
}
