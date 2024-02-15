import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { ApiClient } from "../hooks/ApiClient";
import { emptyUser } from "../types";
import profilePicture from "../assets/Default_Profile_Picture.jpg";

const AccountButton = () => {
    const { user, removeUser } = useUser();
    const { post } = ApiClient();
    const navigate = useNavigate();
  
    async function handleLogout() {
      try {
        await post("/auth/logout", {id: user.id});
        removeUser();
        navigate("/#");
      } catch (error : any) {
        console.error(error);
        alert(error.response ? error.response.data : error);
      }
    }
  
    if(user.id !== emptyUser.id) {
      return (
        <div className="flex flex-row cursor-pointer hover:bg-[#820000] py-[5px] px-[8px]" onClick={handleLogout}>
            <img
              src={profilePicture}
              alt="pfp here"
              className="h-[8vh] w-[4vw] rounded-full"
            />
        </div>
      );
    } else {
      return (
        <div>
          <Link to="/login" className="no-underline text-white font-headlineFont">
            <button className="flex flex-col justify-center items-center w-full no-underline text-2xl h-12 bg-transparent cursor-pointer font-headlineFont border-none duration-500 hover:bg-[#820000] px-4">Login/Register</button>
          </Link>
        </div>
      );
    }
}
  
export default AccountButton;