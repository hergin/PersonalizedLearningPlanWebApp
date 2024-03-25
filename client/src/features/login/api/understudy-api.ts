import { AxiosError } from "axios";
import { useApiConnection } from "../../../hooks/useApiConnection";

const UnderstudyApi = () => {
    const { get } = useApiConnection();

    const fetchUnderstudies = async (accountId: number) => {
        try {
            return await get(`/auth/understudy/${accountId}`);
        } catch(error: unknown) {
            console.error(error);
            alert((error as AxiosError).message ? (error as AxiosError).message : error);
        }
    }

    return { fetchUnderstudies };
}

export default UnderstudyApi;
