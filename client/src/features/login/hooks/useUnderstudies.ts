import { useQuery } from "@tanstack/react-query";
import { AccountApi } from "../api/account-api";

export function useUnderstudies(accountId: number) {
    const { fetchUnderstudies } = AccountApi();
    
    return useQuery({
        queryFn: () => fetchUnderstudies(accountId),
        queryKey: ["understudy", accountId]
    });
}
