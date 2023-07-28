import React, { useState } from "react";
import Button from "../../atoms/Button";
import styles from "./ReportForm.module.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const ReportForm = ({ onClose, username, sender, user }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/report/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sender.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, user }),
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
    <div className={styles.reportform}>
      <div className={styles.reportform__header}>
        <h2>Pranešimas apie naudotojo veiklą - {username}</h2>
        <CloseRoundedIcon
          fontSize="large"
          onClick={onClose}
          className={styles.reportform__close}
        />
      </div>
      {success ? (
        <p>{success}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.reportform__input}>
            <label>Galite pridėti komentarą:</label>
            <textarea
              maxLength={300}
              placeholder="Įveskite paaiškinimą."
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <Button>Siųsti</Button>
          {error && <p className={styles.reportform__error}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ReportForm;
