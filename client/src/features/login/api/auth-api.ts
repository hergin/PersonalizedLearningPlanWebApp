import { useApiConnection } from "../../../hooks/useApiConnection";
import { useUser } from "../hooks/useUser";
import { AxiosError } from "axios";
import { RegisterProps } from "../../../types";

export const AuthApi = () => {
    const { user, addUser, removeUser } = useUser();
    const { post } = useApiConnection();
    
    const login = async (email: string, password: string) => {
        try {
            const response = await post("/auth/login", {email, password});
            addUser({
                id: response.id,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            });
        } catch(error: unknown) {
            console.error(error);
            alert((error as AxiosError).message ? (error as AxiosError).message : error);
        }
    }

    const register = async (registerValues: RegisterProps) => {
        try {
            await post("/auth/register", { email: registerValues.email, password: registerValues.password });
            const response = await post("/auth/login", {email: registerValues.email, password: registerValues.password});
            addUser({
                id: response.id,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            });
            await post("/profile/create", { 
                username: registerValues.username, 
                firstName: registerValues.firstName, 
                lastName: registerValues.lastName, 
                account_id: response.id
            });
        } catch(error: unknown) {
            console.error(error);
            alert((error as AxiosError).message ? (error as AxiosError).message : error);
        }
    }

    const logout = async () => {
        try {
            await post("/auth/logout", {id: user.id});
            removeUser();
        } catch(error: unknown) {
            console.error(error);
            alert((error as AxiosError).message ? (error as AxiosError).message : error);
        }
    }

    return { login, register, logout };
}
