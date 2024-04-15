import DatabaseParser from "../databaseParser";
import { Pool } from "pg";
import { Query } from "../../types";

jest.mock("pg");

const mockQuery: Query = {
    text: "This is a query",
    values: [1, 2, 3]
};

describe("Database Parser Unit Tests", () => {
    var parser: DatabaseParser;
    var mockPoolQuery: jest.Mock;

    beforeEach(() => {
        parser = new DatabaseParser();
        mockPoolQuery = new Pool().query as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Parse Database", async () => {
        const mockResult = {rows: [{message: "Hi."}]};
        mockPoolQuery.mockResolvedValueOnce(mockResult);
        const result = await parser.parseDatabase(mockQuery);
        expect(mockPoolQuery).toHaveBeenCalledTimes(1);
        expect(mockPoolQuery).toHaveBeenCalledWith(mockQuery);
        expect(result).toEqual(mockResult.rows);
    });
});
