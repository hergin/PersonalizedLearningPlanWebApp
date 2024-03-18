import React from "react";
import TabPanel from "../TabPanel";
import { render } from "@testing-library/react";

describe("Tab Panel Unit Tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })
    
    it("Tab Panel is hidden case", () => {
        const { getByTestId } = render(
            <TabPanel
                index={2}
                selectedValue={1}
            >
                This shouldn't display because it's not selected!
            </TabPanel>
        );
        expect(getByTestId("container")).not.toBeVisible();
        expect(() => getByTestId("tabContent")).toThrow("Unable to find an element");
    });

    it("Tab Panel is visible case", () => {
        const { getByTestId } = render(
            <TabPanel
                index={1}
                selectedValue={1}
            >
                This should display because it's selected!                
            </TabPanel>
        );
        expect(getByTestId("container")).toBeVisible();
        expect(getByTestId("tabContent")).toBeInTheDocument();
    });
});
