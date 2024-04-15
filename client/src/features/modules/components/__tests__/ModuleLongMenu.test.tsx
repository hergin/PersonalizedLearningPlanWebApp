import React from "react";
import ModuleLongMenu from "../ModuleLongMenu";
import { render, cleanup, fireEvent } from "@testing-library/react";

const mockOnEditPress = jest.fn();
const mockOnDeletePress = jest.fn();

describe("Module Long Menu Unit Tests", () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Triggers edit press", () => {
        const { getByTestId, getByText } = render(<ModuleLongMenu onEditPress={mockOnEditPress} onDeletionPress={mockOnDeletePress} />);
        fireEvent.click(getByTestId("MoreVertIcon"));
        fireEvent.click(getByText("Edit"));
        expect(mockOnDeletePress).toHaveBeenCalledTimes(0);
        expect(mockOnEditPress).toHaveBeenCalledTimes(1);
    });

    it("Triggers delete press", () => {
        const { getByTestId, getByText } = render(<ModuleLongMenu onEditPress={mockOnEditPress} onDeletionPress={mockOnDeletePress} />);
        fireEvent.click(getByTestId("MoreVertIcon"));
        fireEvent.click(getByText("Delete"));
        expect(mockOnEditPress).toHaveBeenCalledTimes(0);
        expect(mockOnDeletePress).toHaveBeenCalledTimes(1);
    });
});
