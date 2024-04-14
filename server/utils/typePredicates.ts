import { StatusCode, STATUS_CODE } from "../types";

export function isStatusCode<T>(value: T | StatusCode): value is StatusCode {
    let result = false;
    for(const statusCode of Object.values(STATUS_CODE)) {
        result = result || value === statusCode;
    }
    return result;
}
