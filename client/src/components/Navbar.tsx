import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { ApiClient } from "../hooks/ApiClient";

function NavBar() {
  return (
    <header className="flex w-full sticky top-0 flex-col justify-between items-center text-center p-0 bg-white text-text-color z-10">
      <nav className="flex items-center justify-between w-full h-12 bg-element-base p-11">
        <Link to="/#">
          <h1 className="text-3xl font-headlineFont">Personalized Learning Website</h1>
        </Link>
        <AccountButton />
      </nav>

      <nav className="flex flex-row items-center w-full shadow-md">
        <ul className="flex flex-row items-center w-full h-12 text-2xl justify-evenly">
          <li className="inline-block relative after:block after:m-auto after:h-1 after:w-0 after:bg-transparent after:content-[''] after:transition-width after:duration-500 after:ease-in-out  hover:after:w-full hover:after:bg-element-base">
            <Link to="/LearningPlan" className="w-full text-black hover:text-element-base"> Learning Plan</Link>
          </li>
          <li className="inline-block relative after:block after:m-auto after:h-1 after:w-0 after:bg-transparent after:content-[''] after:transition-width after:duration-500 after:ease-in-out  hover:after:w-full hover:after:bg-element-base">
            <Link to="/#" className="w-full text-black hover:text-element-base"> Coach</Link>
          </li>
          <li className="inline-block relative after:block after:m-auto after:h-1 after:w-0 after:bg-transparent after:content-[''] after:transition-width after:duration-500 after:ease-in-out  hover:after:w-full hover:after:bg-element-base">
            <Link to="/#" className="w-full text-black hover:text-element-base"> Dashboard</Link>
          </li>
          <li className="inline-block relative after:block after:m-auto after:h-1 after:w-0 after:bg-transparent after:content-[''] after:transition-width after:duration-500 after:ease-in-out  hover:after:w-full hover:after:bg-element-base">
            <Link to="/profile" className="w-full text-black hover:text-element-base"> Profile</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function AccountButton() {
  const { user, removeUser } = useUser();
  const { post } = ApiClient();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await post("/auth/logout", {email: user.email});
      removeUser();
      navigate("/#");
    } catch (error : any) {
      console.error(error);
      alert(error.response ? error.response.data : error);
    }
  }

  if(user.email !== "") {
    return (
      <div>
        <button className="flex flex-col justify-center items-center w-full no-underline text-2xl h-12 bg-transparent cursor-pointer font-headlineFont border-none duration-500 hover:bg-[#820000] px-4" onClick={handleLogout}>Log out</button>
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

export default NavBar;
