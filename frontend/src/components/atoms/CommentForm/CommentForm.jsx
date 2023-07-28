import React, { useState } from "react";
import Button from "../Button";
import styles from "./CommentForm.module.scss";

const CommentForm = ({ onSubmit, error }) => {
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(body);
    setBody("");
  };
  return (
    <form onSubmit={handleSubmit} className={styles.commentform}>
      <textarea
        maxLength={200}
        placeholder="Įrašykite komentarą."
        id="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <p className={styles.commentform__error}>{error && error}</p>
      <Button disabled={body.length === 0}>Pridėti komentarą</Button>
    </form>
  );
};

export default CommentForm;
