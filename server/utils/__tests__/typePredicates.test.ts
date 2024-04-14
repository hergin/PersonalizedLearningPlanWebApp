import { STATUS_CODE, StatusCode } from "../../types";
import { isStatusCode } from "../typePredicates";

describe("Is Status Code Unit Tests", () => {
    it.each([
        [STATUS_CODE.OK],
        [STATUS_CODE.BAD_REQUEST],
        [STATUS_CODE.UNAUTHORIZED],
        [STATUS_CODE.FORBIDDEN],
        [STATUS_CODE.CONNECTION_ERROR],
        [STATUS_CODE.CONFLICT],
        [STATUS_CODE.GONE],
        [STATUS_CODE.INTERNAL_SERVER_ERROR]
    ])("Status Codes return as true.", (statusCode) => {
        expect(isStatusCode(statusCode)).toBe(true);
    });

    it.each([["400"], [false], [0.0], ["My name is jeff..."], [{imAStatusCode: "trust"}]])
    ("Non-numbers return false.", (fakers) => {
        expect(isStatusCode(fakers)).toBe(false);
    });

    it.each([[0], [69], [1000], [2377], [199]])
    ("Numbers not within status code enum return false", (number) => {
        expect(isStatusCode(number)).toBe(false);
    });
});
