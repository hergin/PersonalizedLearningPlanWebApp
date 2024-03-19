import { useQuery } from "@tanstack/react-query";
import UnderstudyApi from "../api/understudy-api";

export function useUnderstudies(accountId: number) {
    const { fetchUnderstudies } = UnderstudyApi();
    
    return useQuery({
        queryFn: () => fetchUnderstudies(accountId),
        queryKey: ["understudy", accountId]
    });
}
