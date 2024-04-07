import { useApiConnection } from "../../../hooks/useApiConnection";
import { useUser } from "../hooks/useUser";
import { RegisterProps } from "../../../types";
import { throwServerError } from "../../../utils/errorHandlers";

const AccountApi = () => {
    const { user, addUser, removeUser } = useUser();
    const { post, del } = useApiConnection();
    
    const login = async (email: string, password: string) => {
        try {
            const response = await post("/auth/login", {email, password});
            addUser({
                id: response.id,
                role: response.role,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            });
        } catch(error: unknown) {
            throwServerError(error);
        }
    }

    const register = async (registerValues: RegisterProps) => {
        try {
            await post("/auth/register", { email: registerValues.email, password: registerValues.password });
            const response = await post("/auth/login", {email: registerValues.email, password: registerValues.password});
            addUser({
                id: response.id,
                role: response.role,
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
            throwServerError(error);
        }
    }

    const logout = async () => {
        try {
            await post("/auth/logout", {id: user.id});
            removeUser();
        } catch(error: unknown) {
            throwServerError(error);
        }
    }

    const deleteAccount = async (accountId: number) => {
        try {
            await del(`/auth/delete/${accountId}`);
            removeUser();
        } catch(error: unknown) {
            throwServerError(error);
        }
    }

    return { login, register, logout, deleteAccount };
}

export default AccountApi;
