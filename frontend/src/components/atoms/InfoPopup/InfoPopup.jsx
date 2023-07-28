import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import styles from "./InfoPopup.module.scss";

const InfoPopup = ({ onClose, alert }) => {
  return (
    <div className={styles.info}>
      <div className={styles.info__close}>
        <CloseRoundedIcon fontSize="large" onClick={onClose} />
      </div>
      {alert ? (
        <div className={styles.info__alert}>
          <h2 className={styles["info__alert-heading"]}>
            Jūs gavote perspėjimą iš administratoriaus!
          </h2>
          <p>{alert}</p>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default InfoPopup;
