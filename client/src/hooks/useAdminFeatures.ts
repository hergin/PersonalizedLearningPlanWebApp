import AdminApi from "../api/admin-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Role } from "../types";

export function useAccountData() {
    const { fetchAllAccounts } = AdminApi();

    return useQuery({
        queryFn: () => fetchAllAccounts(),
        queryKey: ["account"],
    });
}

export function useRoleUpdater() {
    const queryClient = useQueryClient();
    const { setAccountAsRole } = AdminApi();

    return useMutation({
        mutationFn: ({id, role}: {id: number, role: Role}) => setAccountAsRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["account"]});
        },
    });
}
