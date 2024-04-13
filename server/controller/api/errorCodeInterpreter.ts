import { DatabaseError } from "pg";
import { STATUS_CODE } from "../../types";

export class ErrorCodeInterpreter {
    getStatusCode(error : DatabaseError) {
        switch (error.code) {
            case '23505':
                console.log("Duplicate data.");
                return STATUS_CODE.CONFLICT;
            case '08000': case '08003': case '08007':
                console.log("Connection error");
                return STATUS_CODE.CONNECTION_ERROR;
            case '23514':
                console.log("Bad data.");
                return STATUS_CODE.BAD_REQUEST;
            default:
                console.error("Fatal server error.", error);
                return STATUS_CODE.INTERNAL_SERVER_ERROR;
        }
    }
}
