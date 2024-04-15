import React from "react";
import WarningDialogue from "../WarningDialogue";
import { render, cleanup, fireEvent } from "@testing-library/react";

const mockChild = "Are you sure?";
const mockOnConfirm = jest.fn();
const mockOnCancel = jest.fn();

describe("Warning Dialogue Unit Tests", () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Confirm button triggers onConfirm.", () => {
        const { getByText } = render(
            <WarningDialogue
                open={true}
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
            >
                {mockChild}
            </WarningDialogue>
        );
        const confirmButton = getByText("Confirm");
        fireEvent.click(confirmButton);
        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });

    it("Cancel button triggers onCancel.", () => {
        const { getByText } = render(
            <WarningDialogue
                open={true}
                onConfirm={mockOnConfirm}
                onCancel={mockOnCancel}
            >
                {mockChild}
            </WarningDialogue>
        );
        const cancelButton = getByText("Cancel");
        fireEvent.click(cancelButton);
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
});
