import React, { ReactElement } from "react";

const AccountMenu = jest.fn().mockImplementation((): ReactElement => {
    return (<></>);
});

export default AccountMenu;
