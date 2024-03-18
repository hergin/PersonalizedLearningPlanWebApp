import React, { ReactElement } from "react";

const NavBar = jest.fn().mockImplementation((): ReactElement => {
    return (<></>);
});

export default NavBar;
