import React from "react";
import NavBar from "./Navbar";
import { Outlet } from "react-router";

function DefaultScreen() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default DefaultScreen;
