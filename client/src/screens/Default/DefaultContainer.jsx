import React from 'react';
import NavBar from '../../components/NavBar';
import { Outlet } from 'react-router';

const defaultScreen = () => {
  return (
    <>
      <NavBar /> 
      <Outlet />
    </>
  );
};

export default defaultScreen;