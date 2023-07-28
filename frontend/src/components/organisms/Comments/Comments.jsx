import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Comments.module.scss";
import Delete from "../../atoms/Icons/Delete";
import classNames from "classnames";
import CommentForm from "../../atoms/CommentForm";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import DeletePopup from "../../molecules/DeletePopup";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { lt } from "date-fns/locale";

const Comments = ({ user, petId }) => {
  const [comments, setComments] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const [idToDelete, setIdToDelete] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/comment/${petId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setComments(json);
        setIsLoading(false);
      }

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
      }
    };
    fetchComments();
  }, [petId]);

  const handleSubmit = async (body) => {
    const newComment = { body, pet: petId, author: user.id };

    const response = await fetch(`/api/comment/`, {
      method: "POST",
      body: JSON.stringify(newComment),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setSubmitError(json.error);
    }

    if (response.ok) {
      window.location.reload();
    }
  };

  const handleDelete = async (id) => {
    setIsDeleteLoading(true);
    const response = await fetch("/api/comment/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      setIsDeleteLoading(false);
      setShowConfirmation(false);
      window.location.reload();
    } else if (!response.ok) {
      setIsDeleteLoading(false);
      setDeleteError(json.error);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
  };

  const handleShowConfirmation = (id) => {
    setShowConfirmation(true);
    setIdToDelete(id);
  };

  return (
    <div className={styles.comments}>
      {showConfirmation && (
        <DeletePopup
          title="Ar tikrai norite ištrinti komentarą?"
          onDelete={handleDelete}
          onClose={handleClose}
          id={idToDelete}
          isLoading={isDeleteLoading}
          error={deleteError}
        />
      )}
      <h3 className={styles.comments__title}>Komentarai:</h3>
      {!user?.isAdmin && (
        <CommentForm onSubmit={handleSubmit} error={submitError} />
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className={styles.comments__error}>{error}</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className={styles.comments__comment}>
            <div className={styles.comments__top}>
              <Link to={`/user/${comment.author._id}`}>
                <PersonOutlineOutlinedIcon fontSize="large" />
                <span>
                  {comment.author.isOrganisation &&
                  comment.author.organisationTitle
                    ? comment.author.organisationTitle
                    : comment.author.username}
                </span>
              </Link>
              <div className={styles.comments__corner}>
                <p>
                  {formatDistanceToNowStrict(new Date(comment.createdAt), {
                    addSuffix: true,
                    locale: lt,
                  })}
                </p>
                {(user.id === comment.author._id || user.isAdmin) && (
                  <div
                    title="Ištrinti komentarą"
                    className={styles.comments__delete}
                    onClick={() => handleShowConfirmation(comment._id)}
                  >
                    <Delete />
                  </div>
                )}
              </div>
            </div>
            <p className={styles.comments__body}>{comment.body}</p>
          </div>
        ))
      )}
      <div
        className={classNames({
          [styles["comments--overlay"]]: showConfirmation,
        })}
      ></div>
    </div>
  );
};

export default Comments;
