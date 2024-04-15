import React, { ReactElement } from "react";

const DropDownItem = jest.fn().mockImplementation((): ReactElement => {
    return (<></>);
});

export default DropDownItem;
