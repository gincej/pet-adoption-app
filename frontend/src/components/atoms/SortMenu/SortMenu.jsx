import React from "react";
import styles from "./SortMenu.module.scss";

const SortMenu = ({ sortBy, onSort }) => {
  return (
    <div className={styles.sortmenu}>
      <label htmlFor="sort-by">Rūšiuoti pagal:</label>
      <select id="sort-by" value={sortBy} onChange={onSort}>
        <option value="dateASC">Naujausi skelbimai</option>
        <option value="dateDESC">Seniausi skelbimai</option>
        <option value="locASC">Artimiausia lokacija</option>
        <option value="locDESC">Tolimiausia lokacija</option>
      </select>
    </div>
  );
};

export default SortMenu;
