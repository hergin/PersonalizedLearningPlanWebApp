import React from "react";
import Default from "../assets/Default_Profile_Picture.jpg";

interface ProfilePictureProps {
    source?: string,
    style?: string
}

export default function ProfilePicture({source, style}: ProfilePictureProps) {
    return (
      <img 
        src={source ? source : Default} 
        alt="Profile Picture Here"
        className={`${style ? style : "size-14"} rounded-full`}
      />
    );
}
