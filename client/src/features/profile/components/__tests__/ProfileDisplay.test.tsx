import React from "react";
import ProfileDisplay from "../ProfileDisplay";
import { render, cleanup, Matcher, MatcherOptions } from "@testing-library/react";
import { Profile } from "../../../../types";

jest.mock("../../../../components/ProfilePicture");

describe("Profile Display Unit Tests", () => {
    var mockProfile: Profile;
    var getByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement;

    beforeEach(() => {
        mockProfile = {
            id: 1,
            username: "Xx_TestDummy_xX",
            firstName: "Test",
            lastName: "Dummy",
            jobTitle: "Testing Bag",
            profilePicture: "",
            bio: "I live to be used for testing!",
        };
        getByTestId = render(<ProfileDisplay profile={mockProfile} />).getByTestId;
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it("Renders First Name Normally", () => {
        const childNodes = getByTestId("firstName-div").childNodes;
        expect(childNodes.item(0)).toContainHTML("<p>First Name:</p>");
        expect(childNodes.item(1)).toContainHTML(`<p>${mockProfile.firstName}</p>`);
    });

    it("Renders Last Name Normally", () => {
        const childNodes = getByTestId("lastName-div").childNodes;
        expect(childNodes.item(0)).toContainHTML("<p>Last Name:</p>");
        expect(childNodes.item(1)).toContainHTML(`<p>${mockProfile.lastName}</p>`);
    });

    it("Renders Job Title Normally", () => {
        const childNodes = getByTestId("jobTitle-div").childNodes;
        expect(childNodes.item(0)).toContainHTML("<p>Job Title:</p>");
        expect(childNodes.item(1)).toContainHTML(`<p>${mockProfile.jobTitle}</p>`);
    });
});
