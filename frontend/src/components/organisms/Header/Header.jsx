import React from "react";
import Logo from "../../atoms/Images/Logo/Logo";
import styles from "./Header.module.scss";
import Navbar from "../../molecules/Navbar/";

const Header = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <Navbar />
    </header>
  );
};

export default Header;
