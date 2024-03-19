import React from "react";
import { Link } from "react-router-dom";
import { emptyUser } from "../types";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import ProfilePicture from "./ProfilePicture";
import { useAuth } from "../context/AuthContext";
import AccountMenu from "./AccountMenu";

const CLICKABLE_ELEMENT_STYLE = "hover:bg-[#820000] cursor-pointer duration-500";

export default function AccountButton() {
  const [open, setOpen] = React.useState<boolean>(false);
  const { user } = useAuth();
  
  if(user.id !== emptyUser.id) {
    // Fixed values need to be changed to adjust to smaller screens, but this is fine for now. -Tim
    return (
      <div data-testid="profilePictureMenu">  
        <div 
          data-testid="pictureButton"
          className={`${CLICKABLE_ELEMENT_STYLE} flex flex-row py-[5px] px-[8px] gap-[5px] items-center`} 
          onClick={() => {setOpen(!open)}}
        >
          <ProfilePicture style="size-14" />
          {open ? <FaCaretUp data-testid="caretDown" className="size-5" /> : <FaCaretDown data-testid="caretDown" className="size-5" />}
        </div>
        {open && <AccountMenu user={user} />}
      </div>
    );
  } else {
    return (
      <div data-testid="loginButtonContainer">
        <Link data-testid="loginLink" to="/login" className="no-underline text-white font-headlineFont">
          <button 
            data-testid="loginButton"
            className={`${CLICKABLE_ELEMENT_STYLE} flex flex-col justify-center items-center w-full no-underline text-2xl h-12 bg-transparent font-headlineFont border-none px-4`}
          >
            Login/Register
          </button>
        </Link>
      </div>
    );
  }
}
