import React, { ReactElement } from "react";

const TabPanel = jest.fn().mockImplementation((): ReactElement => {
    return (<></>);
});

export default TabPanel;
