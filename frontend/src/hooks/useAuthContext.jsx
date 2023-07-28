import { AuthContext } from "../context/AuthContext";
import React, { useContext } from "react";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("use auth context must be used inside an authcontextprovider");
  }

  return context;
};
