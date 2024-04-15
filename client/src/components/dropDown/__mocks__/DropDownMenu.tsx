import React, { ReactElement } from "react";

const DropDownMenu = jest.fn().mockImplementation((): ReactElement => {
    return (<></>);
});

export default DropDownMenu;
