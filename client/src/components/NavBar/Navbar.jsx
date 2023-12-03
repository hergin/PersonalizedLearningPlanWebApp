import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { ApiClient } from "../../hooks/ApiClient";
import "./Navbar.css";

function NavBar() {
  return (
    <header>
      <nav className="nav-top">
        <Link to="/#" className="link-dec">
          <h1>Personalized Learning Website</h1>
        </Link>
        <AccountButton />
      </nav>

      <nav className="nav-bottom">
        <ul className="nav-links">
          <li className="nav-li">
            <Link to="/LearningPlan" className="link-dec"> Learning Plan</Link>
          </li>
          <li className="nav-li">
            <Link to="/coach" className="link-dec"> Coach</Link>
          </li>
          <li className="nav-li">
            <Link to="/#" className="link-dec"> Dashboard</Link>
          </li>
          <li className="nav-li">
            <Link to="/#" className="link-dec"> Profile</Link>
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
    } catch(error) {
      console.error(error?.message);
      alert(error?.message);
    }
  }

  if(user.email !== "") {
    return (
      <div>
        <button className="login-btn" onClick={handleLogout}>Log out</button>
      </div>
    );
  } else {
    return (
      <div>
        <Link to="/login" className="link-dec">
          <button className="login-btn">Login/Register</button>
        </Link>
      </div>
    );
  }
}

export default NavBar;
