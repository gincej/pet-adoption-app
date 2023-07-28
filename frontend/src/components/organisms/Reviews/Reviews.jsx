import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Reviews.module.scss";
import Delete from "../../atoms/Icons/Delete";
import Star from "../../atoms/Icons/Star";
import classNames from "classnames";
import ReviewForm from "../../atoms/ReviewForm";
import DeletePopup from "../../molecules/DeletePopup/";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { lt } from "date-fns/locale";

const Reviews = ({ currUser, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      const response = await fetch(`/api/review/${userId}`, {
        headers: { Authorization: `Bearer ${currUser.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setReviews(json);
        setIsLoading(false);
      }

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
      }
    };
    fetchReviews();
  }, [userId]);

  const handleSubmit = async (body, rating) => {
    const newReview = { body, user: userId, author: currUser.id, rating };

    const response = await fetch(`/api/review/`, {
      method: "POST",
      body: JSON.stringify(newReview),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currUser.token}`,
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
    const response = await fetch("/api/review/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${currUser.token}` },
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
    <div className={styles.reviews}>
      {showConfirmation && (
        <DeletePopup
          title="Ar tikrai norite ištrinti atsiliepimą?"
          onDelete={handleDelete}
          onClose={handleClose}
          id={idToDelete}
          isLoading={isDeleteLoading}
          error={deleteError}
        />
      )}
      <h3 className={styles.reviews__title}>Atsiliepimai:</h3>
      {!currUser?.isAdmin &&
        currUser?.id !== userId &&
        !reviews.some((review) => review.author._id === currUser.id) && (
          <ReviewForm onSubmit={handleSubmit} error={submitError} />
        )}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className={styles.reviews__error}>{error}</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className={styles.reviews__review}>
            <div className={styles.reviews__top}>
              <Link to={`/user/${review.author._id}`}>
                <PersonOutlineOutlinedIcon fontSize="large" />
                <span>
                  {review.author.isOrganisation &&
                  review.author.organisationTitle
                    ? review.author.organisationTitle
                    : review.author.username}
                </span>
              </Link>
              <div className={styles.reviews__corner}>
                <p>
                  {formatDistanceToNowStrict(new Date(review.createdAt), {
                    addSuffix: true,
                    locale: lt,
                  })}
                </p>
                {(currUser.id === review.author._id || currUser.isAdmin) && (
                  <div
                    className={styles.reviews__delete}
                    onClick={() => handleShowConfirmation(review._id)}
                  >
                    <Delete />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.reviews__body}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} isSmaller={true} isFilled={i < review.rating} />
              ))}
              <p>{review.body}</p>
            </div>
          </div>
        ))
      )}
      <div
        className={classNames({
          [styles["reviews--overlay"]]: showConfirmation,
        })}
      ></div>
    </div>
  );
};

export default Reviews;
