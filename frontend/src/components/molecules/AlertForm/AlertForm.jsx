import React, { useState } from "react";
import Button from "../../atoms/Button";
import styles from "./AlertForm.module.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const AlertForm = ({ userId, onClose, user }) => {
  const [alert, setAlert] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/user/alert/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ alert }),
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setSuccess(json.message);
    }
  };

  return (
    <div className={styles.alertform}>
      <div className={styles.alertform__header}>
        <h2>Perspėjimo forma</h2>
        <CloseRoundedIcon
          fontSize="large"
          onClick={onClose}
          className={styles.alertform__close}
        />
      </div>
      {success ? (
        <p>{success}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.alertform__input}>
            <label>Pridėkite perspėjimo tekstą</label>
            <textarea
              maxLength={200}
              placeholder="Įveskite norimą perspėjimo tekstą."
              onChange={(e) => setAlert(e.target.value)}
            />
          </div>
          <Button>Siųsti</Button>
          {error && <p className={styles.alertform__error}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default AlertForm;
