import React, { useState, PropsWithChildren, ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { ApiClient } from "../hooks/ApiClient";
import { emptyUser } from "../types";
import profilePicture from "../assets/Default_Profile_Picture.jpg";

/* 
  I edited this now since I needed to add settings to complete the email feature.
  So, feel free to edit any of this in the future. 
  - Tim
*/
const STYLE = {
  border: "border-[0.8px] border-solid border-[rgb(219, 219, 219)]",
  clickableElement: "hover:bg-[#820000] cursor-pointer duration-500",
};

const AccountButton = () => {
    const { user, removeUser } = useUser();
    const { post } = ApiClient();
    const navigate = useNavigate();
  
    async function handleLogout() {
      try {
        await post("/auth/logout", {id: user.id});
        removeUser();
        navigate("/#");
      } catch (error: any) {
        console.error(error);
        alert(error.response ? error.response.data : error);
      }
    }
    
    
    if(user.id !== emptyUser.id) {
      return (
        <ProfilePicture>
          <DropDownMenu />
        </ProfilePicture>
      );
    } else {
      return (
        <div>
          <Link to="/login" className="no-underline text-white font-headlineFont">
            <button className={`flex flex-col justify-center items-center w-full no-underline text-2xl h-12 bg-transparent font-headlineFont border-none ${STYLE.clickableElement} px-4`}>Login/Register</button>
          </Link>
        </div>
      );
    }

    function ProfilePicture(props: PropsWithChildren) {
      const [open, setOpen] = useState<boolean>(false);
      
      return (
        <div>  
          <div className={`${STYLE.clickableElement} py-[5px] px-[8px]`} onClick={() => {setOpen(!open)}}>
            <img
              src={profilePicture}
              alt="pfp here"
              className="h-[8vh] w-[4vw] rounded-full"
            />
          </div>
          {open && props.children}
        </div>
      );
    }

    interface DropDownItemProps extends PropsWithChildren {
      onClick?(): void,
      leftIcon?: ReactElement,
      rightIcon?: ReactElement
    }

    function DropDownMenu() {
      function DropDownItem(props: DropDownItemProps) {
        return(
          <div onClick={props.onClick} className={`h-[50px] p-[0.5rem] flex items-center ${STYLE.clickableElement}`}>
            {props.leftIcon && <span className="icon-button">{props.leftIcon}</span>}
            {props.children}
            {props.rightIcon && <span className="icon-button">{props.rightIcon}</span>}
          </div>
        );
      }
      
      return (  
        <div className={`absolute t-[58px] w-[150px] translate-x-[-45%] ${STYLE.border} p-[1rem] bg-element-base overflow-hidden font-headlineFont`}>
          <DropDownItem onClick={handleLogout}>Logout</DropDownItem>
        </div>
      );
    }
}
  
export default AccountButton;