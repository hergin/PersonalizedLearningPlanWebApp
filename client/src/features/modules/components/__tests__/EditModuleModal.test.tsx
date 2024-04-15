import React from "react";
import EditModuleModal from "../EditModuleModal";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";

const mockModule = {
    id: 1,
    name: "Test Module",
    description: "This module is used for testing.",
    completion: 25,
};

describe("Edit Module Modal Unit Tests", () => {
    var mockEditModule: jest.Mock;
    var mockOnClose: jest.Mock;

    beforeEach(() => {
        mockEditModule = jest.fn();
        mockOnClose = jest.fn();
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Can submit updates by clicking save changes.", () => {
        const newName = "Bob";
        const { getByText, getByTestId } = render(
            <EditModuleModal module={mockModule} isOpen={true} editModule={mockEditModule} onClose={mockOnClose} />
        );
        fireEvent.change(getByTestId("edit-name"), {target: {value: newName}});
        fireEvent.click(getByText("Save Changes"));
        expect(mockEditModule).toHaveBeenCalledTimes(1);
        expect(mockEditModule).toHaveBeenCalledWith({...mockModule, name: newName});
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("Can submit edited name by hitting enter", async () => {
        const newName = "New Name";
        const { getByTestId } = render(
            <EditModuleModal module={mockModule} isOpen={true} editModule={mockEditModule} onClose={mockOnClose} />
        );
        const editName = getByTestId("edit-name");
        fireEvent.change(editName, {target: {value: newName}});
        await waitFor(() => fireEvent.keyUp(editName, {key: "Enter"}));
        expect(mockEditModule).toHaveBeenCalledTimes(1);
        expect(mockEditModule).toHaveBeenCalledWith({...mockModule, name: newName});
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("Can submit edited description by hitting enter", async () => {
        const newDescription = "New Description";
        const { getByTestId } = render(
            <EditModuleModal module={mockModule} isOpen={true} editModule={mockEditModule} onClose={mockOnClose} />
        );
        const editDescription = getByTestId("edit-description");
        fireEvent.change(editDescription, {target: {value: newDescription}});
        await waitFor(() => fireEvent.keyUp(editDescription, {key: "Enter"}));
        expect(mockEditModule).toHaveBeenCalledTimes(1);
        expect(mockEditModule).toHaveBeenCalledWith({...mockModule, description: newDescription});
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
