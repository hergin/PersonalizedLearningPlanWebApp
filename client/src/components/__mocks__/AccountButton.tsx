import React, { ReactElement } from "react";

const AccountButton = jest.fn().mockImplementation((): ReactElement => {
    return (<></>);
});

export default AccountButton;
