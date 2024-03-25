import { useHotKeys } from "../useHotKeys";

describe("useHotKeys Unit Tests", () => {
    const { handleEnterPress } = useHotKeys();
    const mockAction = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("handleEnterPress (normal case)", () => {
        handleEnterPress({key: "Enter"}, mockAction);
        expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it("handleEnterPress (not enter case)", () => {
        handleEnterPress({key: "Not Enter"}, mockAction);
        expect(mockAction).toHaveBeenCalledTimes(0);
    });

    it("handleEnterPress (submission disabled case)", () => {
        handleEnterPress({key: "Enter"}, mockAction, true);
        expect(mockAction).toHaveBeenCalledTimes(0);
    });
});
