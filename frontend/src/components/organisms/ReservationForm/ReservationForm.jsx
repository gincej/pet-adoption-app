import React, { useState } from "react";
import Button from "../../atoms/Button";
import styles from "./ReservationForm.module.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const ReservationForm = ({ onClose, name, pet, user, owner }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/request/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, owner, pet }),
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
    <div className={styles.reservationform}>
      <div className={styles.reservationform__header}>
        <h2>{name} - Rezervacijos forma </h2>
        <CloseRoundedIcon
          fontSize="large"
          onClick={onClose}
          className={styles.reservationform__close}
        />
      </div>
      {success ? (
        <p>{success}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.reservationform__input}>
            <label>Pridėkite tekstą</label>
            <textarea
              maxLength={300}
              placeholder="Įveskite savo kontaktinius duomenis susisiekimui ir/ar trumpą prisistatymą."
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <Button>Siųsti</Button>
          {error && <p className={styles.reservationform__error}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ReservationForm;
