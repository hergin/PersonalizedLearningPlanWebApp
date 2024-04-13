import React from "react";
import CreateModuleModal from "../CreateModuleModal";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { useModuleCreator } from "../../hooks/useModules";

jest.mock("../../hooks/useModules");

const mockAccountId = 0;
const mockIsOpen = true;
const mockModule = {
    name: "Test Module",
    description: "This is a test module...",
};

describe("Creation Modal Unit Tests", () => {
    var mockOnClose: jest.Mock;
    var mockCreator: jest.Mock;
    
    beforeEach(() => {
        mockOnClose = jest.fn();
        mockCreator = useModuleCreator().mutateAsync as jest.Mock;
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Can't submit with null values by pressing the submit button.", () => {
        const { getByText } = render(<CreateModuleModal accountId={mockAccountId} isOpen={mockIsOpen} closeModal={mockOnClose} />);
        fireEvent.click(getByText("Submit"));
        expect(mockCreator).toHaveBeenCalledTimes(0);
        expect(mockOnClose).toHaveBeenCalledTimes(0);
    });

    it("Can't submit with null values by pressing the enter key.", () => {
        const { getByTestId } = render(<CreateModuleModal accountId={mockAccountId} isOpen={mockIsOpen} closeModal={mockOnClose} />);
        fireEvent.keyUp(getByTestId("input-name"), {key: "Enter"});
        fireEvent.keyUp(getByTestId("input-description"), {key: "Enter"});
        expect(mockCreator).toHaveBeenCalledTimes(0);
        expect(mockOnClose).toHaveBeenCalledTimes(0);
    });

    it("Can create new module without null values by pressing submit.", async () => {
        const { getByText, getByTestId } = render(<CreateModuleModal accountId={mockAccountId} isOpen={mockIsOpen} closeModal={mockOnClose} />);
        fireEvent.change(getByTestId("input-name"), {target: {value: mockModule.name}});
        fireEvent.change(getByTestId("input-description"), {target: {value: mockModule.description}});
        await waitFor(() => fireEvent.click(getByText("Submit")));
        expect(mockCreator).toHaveBeenCalledTimes(1);
        expect(mockCreator).toHaveBeenCalledWith({module_name: mockModule.name, description: mockModule.description, account_id: mockAccountId});
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("Can create new module without null values by pressing enter.", async () => {
        const { getByTestId } = render(<CreateModuleModal accountId={mockAccountId} isOpen={mockIsOpen} closeModal={mockOnClose} />);
        const nameInput = getByTestId("input-name");
        const descriptionInput = getByTestId("input-description");
        fireEvent.change(nameInput, {target: {value: mockModule.name}});
        fireEvent.change(descriptionInput, {target: {value: mockModule.description}});
        await waitFor(() => fireEvent.keyUp(descriptionInput, {key: "Enter"}));
        expect(mockCreator).toHaveBeenCalledTimes(1);
        expect(mockCreator).toHaveBeenCalledWith({module_name: mockModule.name, description: mockModule.description, account_id: mockAccountId});
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
