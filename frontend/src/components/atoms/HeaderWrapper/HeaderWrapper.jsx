import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../../organisms/Header";

const noNavRoutes = ["/login", "/signup"];

const HeaderWrapper = ({ children }) => {
  const location = useLocation();
  const displayHeader = !noNavRoutes.includes(location.pathname);
  return displayHeader ? <Header /> : children;
};

export default HeaderWrapper;
