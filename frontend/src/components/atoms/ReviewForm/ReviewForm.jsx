import React, { useState } from "react";
import Button from "../Button";
import styles from "./ReviewForm.module.scss";
import Star from "../Icons/Star";

const ReviewForm = ({ onSubmit, error }) => {
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(body, rating);
    setBody("");
    setRating(0);
  };

  const handleRating = (r) => {
    setRating(r + 1);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewform}>
      <div className={styles.reviewform__stars}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            isFilled={i < rating}
            handleClick={() => handleRating(i)}
          />
        ))}
      </div>
      <textarea
        maxLength={200}
        placeholder="Įrašykite atsiliepimą."
        id="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <p className={styles.reviewform__error}>{error && error}</p>
      <Button disabled={body.length === 0}>Pridėti atsiliepimą</Button>
    </form>
  );
};

export default ReviewForm;
