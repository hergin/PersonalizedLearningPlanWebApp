import { useApiConnection } from "../hooks/useApiConnection";
import { useAuth } from "../context/AuthContext";
import { throwServerError } from "../utils/errorHandlers";
import { Role } from "../types";

const AdminApi = () => {
    const { user } = useAuth();
    const { get, put } = useApiConnection();
    
    async function fetchAllAccounts(): Promise<any | null> {
        if(user.role !== "admin") {
            return null;
        }
        
        try {
            return await get("/admin/account");
        } catch(error: unknown) {
            throwServerError(error);
            return null;
        }
    }

    async function setAccountAsRole(id: number, role: Role) {
        if(user.role !== "admin") {
            return;
        }

        try {
            await put(`/admin/account/${id}`, {role: role});
        } catch(error: unknown) {
            throwServerError(error);
        }
    }

    return {fetchAllAccounts, setAccountAsRole};
};

export default AdminApi;
