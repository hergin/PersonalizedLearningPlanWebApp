import { isAxiosError } from "axios";

export function throwServerError(error: unknown) {
    console.error(error);
    if(error instanceof Error) {
        if(isAxiosError(error)) {
            alert(error.response ? error.response.data : error.message);
            return;
        }
        alert(error.message);
    }
}
