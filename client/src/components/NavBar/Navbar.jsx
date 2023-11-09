import React from "react";
import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom"
import "./Navbar.css";

function NavBar() {
  return (
    <header>
      <nav className="nav-top">
        <Link className="home-btn" to="/#">
          <AiFillHome />
        </Link>
        <h1>Personalized Learning Website</h1>
        <Link to="/login">
          <button>Login/Sign Up</button>
        </Link>  
      </nav>

      <nav className="nav-bottom">
        <Link to="/LearningPlan">
          <button className="nav-btn">Learning Plan</button>
        </Link>
        <Link to="/#">
          <button className="nav-btn">Coach</button>
        </Link>
        <Link to="/#">
          <button className="nav-btn">Dashboard</button>
        </Link>
        <Link to="/#">
          <button className="nav-btn">Profile</button>
        </Link>
      </nav>
    </header>
  );
}

export default NavBar;
