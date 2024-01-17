import React from 'react';
import NavBar from '../components/Navbar';
import { Outlet } from 'react-router';

function DefaultScreen() {
  

  return (
    <>
      <NavBar /> 
      <Outlet />
    </>
  );
};

export default DefaultScreen;