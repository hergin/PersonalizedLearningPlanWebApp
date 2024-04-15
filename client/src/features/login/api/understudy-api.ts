import { useApiConnection } from "../../../hooks/useApiConnection";
import { throwServerError } from "../../../utils/errorHandlers";

const UnderstudyApi = () => {
    const { get } = useApiConnection();

    const fetchUnderstudies = async (accountId: number) => {
        try {
            return await get(`/auth/understudy/${accountId}`);
        } catch(error: unknown) {
            throwServerError(error);
        }
    }

    return { fetchUnderstudies };
}

export default UnderstudyApi;
