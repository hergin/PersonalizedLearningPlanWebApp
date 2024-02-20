import { StatusCode } from "../types";

export function initializeErrorMap() {
    const errorMessageMap = new Map();
    errorMessageMap.set(StatusCode.OK, "Data received is invalid. Please try again.");
    errorMessageMap.set(StatusCode.UNAUTHORIZED, "Invalid Login.");
    errorMessageMap.set(StatusCode.FORBIDDEN, "Forbidden request.");
    errorMessageMap.set(StatusCode.CONNECTION_ERROR, "Failed to connect to database.");
    errorMessageMap.set(StatusCode.CONFLICT, "An account with that email already exists.");
    errorMessageMap.set(StatusCode.GONE, "An account with that email doesn't exist.");
    errorMessageMap.set(StatusCode.INTERNAL_SERVER_ERROR, "A fatal error has occurred.");
    return errorMessageMap;
}
