import React from "react";
import { AiFillHome } from "react-icons/ai";
import "./Navbar.css";

function NavBar() {
  return (
    <header>
      <nav className="nav-top">
        <a class="home-btn" href="/#">
          <AiFillHome />
        </a>
        <h1>Personalized Learning Website</h1>
        <button>Login/Sign Up</button>
      </nav>

      <nav className="nav-bottom">
        <a href="/LearningPlan">
          <button className="nav-btn">Learning Plan</button>
        </a>
        <a href="/#">
          <button className="nav-btn">Coach</button>
        </a>
        <a href="/#">
          <button className="nav-btn">Dashboard</button>
        </a>
        <a href="/#">
          <button className="nav-btn">Profile</button>
        </a>
      </nav>
    </header>
  );
}

export default NavBar;
