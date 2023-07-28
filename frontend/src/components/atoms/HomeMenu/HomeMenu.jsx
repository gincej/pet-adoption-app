import React from "react";
import styles from "./HomeMenu.module.scss";
import classNames from "classnames";

const HomeMenu = ({ onOptionChange, option }) => {
  return (
    <div className={styles.menu}>
      <div
        className={classNames(styles.menu__side, {
          [styles["menu__side--active"]]: option === "all",
        })}
        onClick={() => onOptionChange("all")}
      >
        Visi skelbimai
      </div>
      <div
        className={classNames(styles.menu__side, {
          [styles["menu__side--active"]]: option === "mine",
        })}
        onClick={() => onOptionChange("mine")}
      >
        Mano skelbimai
      </div>
    </div>
  );
};

export default HomeMenu;
