import { DatabaseError } from "pg";
import { STATUS_CODE, StatusCode } from "../types";

const databaseErrorStatusMap = initializeDatabaseErrorStatusMap();
function initializeDatabaseErrorStatusMap() {
    const map = new Map();
    map.set('23505', STATUS_CODE.CONFLICT);
    map.set('08000', STATUS_CODE.CONNECTION_ERROR);
    map.set('08003', STATUS_CODE.CONNECTION_ERROR);
    map.set('08007', STATUS_CODE.CONNECTION_ERROR);
    map.set('23514', STATUS_CODE.BAD_REQUEST);
    return map;
}

export function convertDatabaseErrorToStatusCode(error: DatabaseError) {
    const result = databaseErrorStatusMap.get(error.code);
    return result ?? STATUS_CODE.INTERNAL_SERVER_ERROR;
}

const loginErrorMessageMap = initializeLoginErrorMap();
function initializeLoginErrorMap(): Map<StatusCode, string> {
    const map = new Map();
    map.set(STATUS_CODE.BAD_REQUEST, "Data received is invalid. Please try again.");
    map.set(STATUS_CODE.UNAUTHORIZED, "Invalid Login.");
    map.set(STATUS_CODE.FORBIDDEN, "Forbidden request.");
    map.set(STATUS_CODE.CONNECTION_ERROR, "Failed to connect to database.");
    map.set(STATUS_CODE.CONFLICT, "An account with that email already exists.");
    map.set(STATUS_CODE.GONE, "An account with that email doesn't exist.");
    map.set(STATUS_CODE.INTERNAL_SERVER_ERROR, "A fatal error has occurred.");
    return map;
}

export function getLoginError(code: StatusCode) {
    return loginErrorMessageMap.get(code);
}
