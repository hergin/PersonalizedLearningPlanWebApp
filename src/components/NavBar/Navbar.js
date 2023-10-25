import React, { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

function NavBar() {
  const navRef = useRef();

  const toggleNav = () => {
    navRef.current.classList.toggle("responsive-nav");
  };

  return (
    <header>
      <nav>
        <a href="/#">Home</a>
        <h3>Personalized Learning Website</h3>
        <a href="/#">Login</a>
      </nav>

      <nav ref={navRef}>
        <a href="/#">Learning Plan</a>
        <a href="/#">Coach</a>
        <a href="/#">Dashboard</a>
        <a href="/#">Profile</a>
        <button onClick={toggleNav}>
          <FaTimes />
        </button>
      </nav>
      <button>
        <FaBars />
      </button>
    </header>
  );
}

export default NavBar;
