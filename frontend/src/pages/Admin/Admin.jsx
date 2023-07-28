import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Admin.module.scss";
import classNames from "classnames";
import AdminUsers from "../../components/organisms/AdminUsers";
import AdminReports from "../../components/organisms/AdminReports";
import AdminCategories from "../../components/organisms/AdminCategories";

const Admin = () => {
  const [active, setActive] = useState("categories");
  const location = useLocation();

  useEffect(() => {
    document.title = "Petix | Administratoriaus sistema";
  }, []);

  useEffect(() => {
    if (location.state) {
      setActive(location.state.value);
    }
  }, [location]);

  return (
    <div className={styles.admin}>
      <aside className={styles.admin__sidebar}>
        <ul>
          <li
            className={classNames({
              [[styles.admin__active]]: active === "user-list",
            })}
            onClick={() => setActive("user-list")}
          >
            Naudotojų sąrašas
          </li>
          <li
            className={classNames({
              [[styles.admin__active]]: active === "reports",
            })}
            onClick={() => setActive("reports")}
          >
            Pranešimai apie naudotojus
          </li>
          <li
            className={classNames({
              [[styles.admin__active]]: active === "categories",
            })}
            onClick={() => setActive("categories")}
          >
            Veislių redagavimas
          </li>
        </ul>
      </aside>
      <div className={styles.admin__main}>
        {active === "user-list" && <AdminUsers />}
        {active === "reports" && <AdminReports />}
        {active === "categories" && <AdminCategories />}
      </div>
    </div>
  );
};

export default Admin;
