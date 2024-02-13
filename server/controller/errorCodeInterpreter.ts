import { StatusCode } from "../types";

export class ErrorCodeInterpreter {
    getStatusCode(error : any) {
        switch (error.code) {
            case '23505':
                console.log("Duplicate data.");
                return StatusCode.CONFLICT;
            case '08000': case '08003': case '08007':
                console.log("Connection error");
                return StatusCode.CONNECTION_ERROR;
            case '23514':
                console.log("Bad data.");
                return StatusCode.BAD_REQUEST;
            default:
                console.error("Fatal server error.", error);
                return StatusCode.INTERNAL_SERVER_ERROR;
        }
    }
}
