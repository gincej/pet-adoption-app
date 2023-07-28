import React, { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [state, dispatch] = useReducer(authReducer, {
    user:
      {
        id: loggedUser?.id,
        token: loggedUser?.token,
        isAdmin: loggedUser?.role === 358965,
      } || null,
  });

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
