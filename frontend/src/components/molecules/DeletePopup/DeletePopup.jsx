import React from "react";
import Button from "../../atoms/Button";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import styles from "./DeletePopup.module.scss";

const DeletePopup = ({ title, onDelete, id, onClose, isLoading, error }) => {
  return (
    <div className={styles.popup}>
      <div className={styles.popup__header}>
        <h2>{title}</h2>
        <CloseRoundedIcon
          fontSize="large"
          onClick={onClose}
          className={styles.popup__close}
        />
      </div>
      {isLoading && <LoadingSpinner />}
      <div className={styles.popup__buttons}>
        <Button onClick={() => onDelete(id)} style="lighter">
          Patvirtinti
        </Button>
        <Button style="red" onClick={onClose}>
          Atšaukti
        </Button>
      </div>
    </div>
  );
};

export default DeletePopup;
