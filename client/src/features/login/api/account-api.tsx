import { AxiosError } from "axios";
import { ApiClient } from "../../../hooks/ApiClient";


export const AccountApi = () => {
    const { get } = ApiClient();

    const fetchUnderstudies = async (accountId: number) => {
        try {
            return await get(`/auth/understudy/${accountId}`);
        } catch(error: unknown) {
            console.error(error);
            alert((error as AxiosError).message ? (error as AxiosError).message : error);
        }
        
    }

    return {fetchUnderstudies};
}
