import React from "react";
import ProfileEditor from "../ProfileEditor";
import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { Profile } from "../../../../types";
import { useProfileUpdater } from "../../hooks/useProfile";

jest.mock("../../hooks/useProfile");

const mockAccountId = 0;
const mockKey = "Enter";
const TEST_PROFILE: Profile = {
    id: 1,
    username: "Xx_TestDummy_xX",
    firstName: "Test",
    lastName: "Dummy",
    profilePicture: "",
    jobTitle: "Punching Bag",
    bio: "I live for unit testing!"
};
const mockOnSave = jest.fn();
const mockOnCancel = jest.fn();

describe("Profile Editor Unit Tests", () => {
    var mockUpdater: any;
    
    beforeEach(() => {
        mockUpdater = useProfileUpdater(mockAccountId);
    });
    
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });
    
    it("Profile objects are separated.", () => {
        const { getByTestId } = render(
            <ProfileEditor 
                accountId={mockAccountId}
                profile={TEST_PROFILE}
                open={true}
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );
        const newUsername = getByTestId("ID-username");
        fireEvent.change(newUsername, {target: {value: "changed"}});
        expect(TEST_PROFILE.username).not.toEqual(newUsername);
        expect(mockOnSave).toHaveBeenCalledTimes(0);
        expect(mockOnCancel).toHaveBeenCalledTimes(0);
    });

    it("saveChanges is called when you click on Confirm button", async () => {
        const { getByText } = render(
            <ProfileEditor 
                accountId={mockAccountId}
                profile={TEST_PROFILE}
                open={true}
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );
        const confirmButton = getByText("Confirm");
        fireEvent.click(confirmButton);
        expect(mockUpdater.mutateAsync).toHaveBeenCalledTimes(1);
        expect(mockUpdater.mutateAsync).toHaveBeenCalledWith(TEST_PROFILE);
        await waitFor(mockUpdater.mutateAsync);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith(TEST_PROFILE);
        expect(mockOnCancel).toHaveBeenCalledTimes(0);
    });

    it("saveChanges is called when you press enter.", async () => {       
        const { getByTestId } = render(
            <ProfileEditor 
                accountId={mockAccountId}
                profile={TEST_PROFILE}
                open={true}
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );
        fireEvent.keyUp(getByTestId("ID-username"), {key: mockKey});
        expect(mockUpdater.mutateAsync).toHaveBeenCalledTimes(1);
        expect(mockUpdater.mutateAsync).toHaveBeenCalledWith(TEST_PROFILE);
        await waitFor(mockUpdater.mutateAsync);
        expect(mockOnSave).toHaveBeenCalledTimes(1);
        expect(mockOnSave).toHaveBeenCalledWith(TEST_PROFILE);
        expect(mockOnCancel).toHaveBeenCalledTimes(0);
    });

    it("onCancel is called when cancel button is pressed", () => {
        const { getByText } = render(
            <ProfileEditor 
                accountId={mockAccountId}
                profile={TEST_PROFILE}
                open={true}
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );
        const cancelButton = getByText("Cancel");
        fireEvent.click(cancelButton);
        expect(mockOnSave).toHaveBeenCalledTimes(0);
        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it("You can't confirm changes when a required field is blank.", () => {
        const { getByText, getByTestId } = render(
            <ProfileEditor 
                accountId={mockAccountId}
                profile={{...TEST_PROFILE, username: ""}}
                open={true}
                onSave={mockOnSave}
                onCancel={mockOnCancel}
            />
        );
        fireEvent.click(getByText("Confirm"));
        fireEvent.keyUp(getByTestId("ID-username"), {key: "Enter"});
        expect(mockUpdater.mutateAsync).toHaveBeenCalledTimes(0);
        expect(mockOnSave).toHaveBeenCalledTimes(0);
    });
});
