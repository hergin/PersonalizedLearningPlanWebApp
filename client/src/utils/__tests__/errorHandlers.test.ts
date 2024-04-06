import { throwServerError } from "../errorHandlers";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";

jest.mock("axios", () => ({
    isAxiosError: jest.fn(),
    AxiosError: jest.fn().mockImplementation((message) => {
        const error = Object.create(Error.prototype);
        return Object.assign(error, {
            message: message,
            response: undefined
        });
    }),
}));

const mockMessage = "This is a mock error!";
const mockAxiosError: AxiosError = new AxiosError(mockMessage);

describe("Error Handlers Unit Tests", () => {
    var mockIsAxiosError: jest.Mock<any, any, any>;
    var consoleSpy: jest.SpyInstance<void, any, any>;
    var alertSpy: jest.SpyInstance<void, any, any>;

    beforeEach(() => {
        mockIsAxiosError = isAxiosError as any as jest.Mock;
        consoleSpy = jest.spyOn(global.console, 'error');
        alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Throw Server Error (not an error case)", () => {
        const mockError: string = "I'm hacking you!";
        throwServerError(mockError);
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith(mockError);
        expect(mockIsAxiosError).toHaveBeenCalledTimes(0);
        expect(alertSpy).toHaveBeenCalledTimes(0);
    });

    it("Throw Server Error (not axios error case)", () => {
        const mockError: Error = new Error(mockMessage);
        mockIsAxiosError.mockReturnValue(false);
        throwServerError(mockError);
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith(mockError);
        expect(mockIsAxiosError).toHaveBeenCalledTimes(1);
        expect(mockIsAxiosError).toHaveBeenCalledWith(mockError);
        expect(alertSpy).toHaveBeenCalledTimes(1);
        expect(alertSpy).toHaveBeenCalledWith(mockError.message);
    });

    it("Throw Server Error (axios error, no response case)", () => {
        mockIsAxiosError.mockReturnValue(true);
        throwServerError(mockAxiosError);
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith(mockAxiosError);
        expect(mockIsAxiosError).toHaveBeenCalledTimes(1);
        expect(mockIsAxiosError).toHaveBeenCalledWith(mockAxiosError);
        expect(alertSpy).toHaveBeenCalledTimes(1);
        expect(alertSpy).toHaveBeenCalledWith(mockAxiosError.message);
    });

    it("Throw Server Error (axios error, no response case)", () => {
        const mockData = "Mock data!!"
        mockAxiosError.response = {data: mockData} as unknown as AxiosResponse;
        mockIsAxiosError.mockReturnValue(true);
        throwServerError(mockAxiosError);
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith(mockAxiosError);
        expect(mockIsAxiosError).toHaveBeenCalledTimes(1);
        expect(mockIsAxiosError).toHaveBeenCalledWith(mockAxiosError);
        expect(alertSpy).toHaveBeenCalledTimes(1);
        expect(alertSpy).toHaveBeenCalledWith(mockData);
    });
});
