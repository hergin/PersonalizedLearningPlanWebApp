import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { emptyUser } from "../types";
import AccountButton from "./AccountButton";

const LIST_ITEM_STYLE = "inline-block relative after:block after:m-auto after:h-1 after:w-0 after:bg-transparent after:content-[''] after:transition-width after:duration-500 after:ease-in-out  hover:after:w-full hover:after:bg-element-base"
const LINK_STYLE = "w-full text-black hover:text-element-base";

const NavBar = () => {
  const { user } = useAuth();

  return (
    <header className="flex w-full sticky top-0 flex-col justify-between items-center text-center p-0 bg-white text-text-color z-10">
      <nav 
        className="flex items-center justify-between w-full h-12 bg-element-base p-11"
        data-testid="top-level-navbar"
      >
        <Link to="/#">
          <h1 id="header" className="text-3xl font-headlineFont">
            Personalized Learning Website
          </h1>
        </Link>
        <AccountButton />
      </nav>
      {
        user.id !== emptyUser.id && (
          <nav 
            className="flex flex-row items-center w-full shadow-md"
            data-testid="bottom-level-navbar"
          >
            <ul className="flex flex-row items-center w-full h-12 text-2xl justify-evenly">
              <li id="moduleItem" className={LIST_ITEM_STYLE}>
                <Link
                  to="/LearningPlan"
                  className={LINK_STYLE}
                  data-testid="modulesLink"
                >
                  {" "}
                  Goal Sets
                </Link>
              </li>
              <li className={LIST_ITEM_STYLE}>
                <Link 
                  to="/coaching" 
                  className={LINK_STYLE}
                  data-testid="coachingLink"
                >
                  {" "}
                  Coach
                </Link>
              </li>
              <li className={LIST_ITEM_STYLE}>
                <Link
                  to="/profile"
                  className={LINK_STYLE}
                  data-testid="profileLink"
                >
                  {" "}
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        )
      }
    </header>
  );
};

export default NavBar;
