import { StatusCode } from "../types";

export default function isStatusCode<T>(value: T | StatusCode): value is StatusCode {
    return value as StatusCode in StatusCode;
}
