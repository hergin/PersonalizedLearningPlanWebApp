import React, { ReactElement } from "react";

const ProfilePicture = jest.fn().mockImplementation((): ReactElement => {
    return (<></>);
});

export default ProfilePicture;
