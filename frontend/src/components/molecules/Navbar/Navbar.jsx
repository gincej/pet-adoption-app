import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.scss";
import Favorites from "../../atoms/Icons/Favorites";
import ProfileIcon from "../../atoms/Icons/ProfileIcon";
import Button from "../../atoms/Button";
import DropdownMenu from "../DropdownMenu";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuthContext();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth <= 900 ? setIsMobile(true) : setIsMobile(false);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className={styles.navbar}>
      {user?.isAdmin ? (
        <Button onClick={() => navigate("/admin-panel")} style="red">
          {isMobile ? "Admin. panelė" : "Administratoriaus panelė"}
        </Button>
      ) : (
        <Button onClick={() => navigate("/add-pet")} style="outlined">
          {isMobile ? "Pridėti" : "Pridėti naują skelbimą"}
        </Button>
      )}
      <div className={styles.navbar__divider}> </div>
      {user ? (
        <>
          {!user?.isAdmin && (
            <span title="Pažymėti augintiniai">
              <Favorites />
            </span>
          )}
          <span
            title="Profilis"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            ref={dropdownRef}
          >
            <ProfileIcon />
          </span>
          {isDropdownOpen && <DropdownMenu user={user} />}
        </>
      ) : (
        <>
          <Link to="/login">Prisijungimas</Link>

          <Link to="/signup">Registracija</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
