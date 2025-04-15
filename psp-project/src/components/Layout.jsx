import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./main/AppNavbar";
import AppNavbar from "./main/AppNavbar";

const Layout = () => {
  return (
    <>
      <AppNavbar />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
