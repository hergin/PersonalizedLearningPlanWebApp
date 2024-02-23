import React, { useState, PropsWithChildren } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { ApiClient } from "../hooks/ApiClient";
import { emptyUser } from "../types";
import profilePicture from "../assets/Default_Profile_Picture.jpg";
import DropDownMenu from "./dropDown/DropDownMenu";
import DropDownItem from "./dropDown/DropDownItem";
import DropDownCheckbox from "./dropDown/DropDownCheckbox";
import useSettings from "../hooks/useSettings";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IoIosLogOut } from "react-icons/io";
import { FaCaretUp } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";

const CLICKABLE_ELEMENT_STYLE = "hover:bg-[#820000] cursor-pointer duration-500";

const AccountButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { user, removeUser } = useUser();
  const { post, put } = ApiClient();
  const navigate = useNavigate();
  const {data, isLoading, error} = useSettings(user.id);
  const queryClient = useQueryClient();
  const [receivesEmail, setReceivesEmail] = useState<boolean>(() => {
    if(isLoading || error || !data) {
      return true;
    }
    return data[0].receive_emails;
  });

  async function handleLogout() {
    try {
      await post("/auth/logout", {id: user.id});
      removeUser();
      navigate("/#");
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      alert(axiosError.response ? axiosError.response.data : error);
    }
  }

  async function handleCheckChange(checked : boolean) {
      try {
          await put(`settings/update/${user.id}`, {receiveEmails: checked});
          queryClient.invalidateQueries({queryKey: ["settings"]});
          setReceivesEmail(checked);
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error(error);
        alert(axiosError.response ? axiosError.response.data : error);
      }
  }
  
  if(user.id !== emptyUser.id) {
    // Fixed values need to be changed to adjust to smaller screens, but this is fine for now. -Tim
    return (
      <ProfilePicture>
        <DropDownMenu absolutePosition="absolute top-[58px] w-[190px] translate-x-[-45%] translate-y-[20px]">
          <DropDownCheckbox handleCheckToggle={handleCheckChange} checked={receivesEmail}>
            Receives Email
          </DropDownCheckbox>
          <DropDownItem leftIcon={<IoIosLogOut className="size-6" />} onClick={handleLogout}>Logout</DropDownItem>
        </DropDownMenu>
      </ProfilePicture>
    );
  } else {
    return (
      <div>
        <Link to="/login" className="no-underline text-white font-headlineFont">
          <button className={`flex flex-col justify-center items-center w-full no-underline text-2xl h-12 bg-transparent font-headlineFont border-none ${CLICKABLE_ELEMENT_STYLE} px-4`}>Login/Register</button>
        </Link>
      </div>
    );
  }

  function ProfilePicture(props: PropsWithChildren) {
    return (
      <div>  
          <div className={`flex flex-row ${CLICKABLE_ELEMENT_STYLE} py-[5px] px-[8px] gap-[5px] items-center`} onClick={() => {setOpen(!open)}}>
            <img
              src={profilePicture}
              alt="pfp here"
              className="h-[8vh] w-[4vw] rounded-full"
            />
            {open ? <FaCaretUp className="size-5" /> : <FaCaretDown className="size-5" />}
          </div>
        {open && props.children}
      </div>
    );
  }
}

export default AccountButton;
