import React from "react";
import styles from "./PageNotFound.module.scss";
import Button from "../../components/atoms/Button";

const PageNotFound = () => {
  return (
    <div className={styles.pagenotfound}>
      <h2>Toks puslapis neegzistuoja.</h2>
      <Button to="/" style="lighter">
        Grįžti į pagrindinį
      </Button>
    </div>
  );
};

export default PageNotFound;
