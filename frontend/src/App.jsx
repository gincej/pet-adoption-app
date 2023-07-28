import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import HeaderWrapper from "./components/atoms/HeaderWrapper";
import Home from "./pages/Home";
import PetForm from "./pages/PetForm";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Reservations from "./pages/Reservations";
import PetDetails from "./pages/PetDetails";
import UserDetailsForm from "./pages/UserDetailsForm";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import PageNotFound from "./pages/PageNotFound";

function App() {
  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <HeaderWrapper />
      <Routes>
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/user/:id"
          element={user ? <Profile /> : <Navigate to="/signup" />}
        />
        <Route
          path="/user/details/:id"
          element={user ? <UserDetailsForm /> : <Navigate to="/signup" />}
        />
        <Route
          path="/pets/:id"
          element={user ? <PetDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-pet"
          element={user ? <PetForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit/:id"
          element={user ? <PetForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/reservations"
          element={user ? <Reservations /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin-panel"
          element={user && user.isAdmin ? <Admin /> : <Navigate to="/login" />}
        />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
