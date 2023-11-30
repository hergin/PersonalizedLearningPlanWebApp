const STATUS_CODES = require("./statusCodes");

function initializeErrorMap() {
    const errorMessageMap = new Map();
    errorMessageMap.set(STATUS_CODES.BAD_REQUEST, "Data received is invalid. Please try again.");
    errorMessageMap.set(STATUS_CODES.UNAUTHORIZED, "Invalid Login.");
    errorMessageMap.set(STATUS_CODES.FORBIDDEN, "Forbidden request.");
    errorMessageMap.set(STATUS_CODES.CONNECTION_ERROR, "Failed to connect to database.");
    errorMessageMap.set(STATUS_CODES.CONFLICT, "An account with that email already exists.");
    errorMessageMap.set(STATUS_CODES.GONE, "An account with that email doesn't exist.");
    errorMessageMap.set(STATUS_CODES.INTERNAL_SERVER_ERROR, "A fatal error has occurred.");
    return errorMessageMap;
}

module.exports = initializeErrorMap;
