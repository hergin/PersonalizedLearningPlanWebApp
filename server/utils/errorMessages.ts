import { STATUS_CODE } from "../types";

export function initializeErrorMap() {
    const errorMessageMap = new Map();
    errorMessageMap.set(STATUS_CODE.OK, "Data received is invalid. Please try again.");
    errorMessageMap.set(STATUS_CODE.UNAUTHORIZED, "Invalid Login.");
    errorMessageMap.set(STATUS_CODE.FORBIDDEN, "Forbidden request.");
    errorMessageMap.set(STATUS_CODE.CONNECTION_ERROR, "Failed to connect to database.");
    errorMessageMap.set(STATUS_CODE.CONFLICT, "An account with that email already exists.");
    errorMessageMap.set(STATUS_CODE.GONE, "An account with that email doesn't exist.");
    errorMessageMap.set(STATUS_CODE.INTERNAL_SERVER_ERROR, "A fatal error has occurred.");
    return errorMessageMap;
}
