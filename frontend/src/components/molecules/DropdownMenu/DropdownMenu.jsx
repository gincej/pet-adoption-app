import React from "react";
import styles from "./DropdownMenu.module.scss";
import { Link } from "react-router-dom";
import { useLogout } from "../../../hooks/useLogout";

const DropdownMenu = ({ user }) => {
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.dropdown}>
      <ul className={styles.dropdown__list}>
        {!user?.isAdmin && (
          <>
            <li>
              <Link to={`user/${user.id}`}>Mano profilis</Link>
            </li>
            <li>
              <Link to={`/user/details/${user.id}`}>Redaguoti profilį</Link>
            </li>
            <li>
              <Link to={`/reservations`}>Mano rezervacijos</Link>
            </li>
          </>
        )}
        <li>
          <span onClick={handleLogout}>Atsijungti</span>
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
