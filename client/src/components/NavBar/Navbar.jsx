import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function NavBar() {
  return (
    <header>
      <nav className="nav-top">
        <Link  to="/#" className="link-dec">
          <h1>Personalized Learning Website</h1>
        </Link>
        
        <Link to="/login" className="link-dec">
          <button className="login-btn">Login/Sign Up</button>
        </Link>
      </nav>

      <nav className="nav-bottom">
        <ul className="nav-links">
          <li className="nav-li">
            <a href="/LearningPlan"> Learning Plan</a>
          </li>
          <li className="nav-li">
            <a href="/#"> Coach</a>
          </li>
          <li className="nav-li">
            <a href="/#"> Dashboard</a>
          </li>
          <li className="nav-li">
            <a href="/#"> Profile</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
