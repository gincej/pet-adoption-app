import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { lt } from "date-fns/locale";
import Button from "../../components/atoms/Button";
import Star from "../../components/atoms/Icons/Star";
import styles from "./Profile.module.scss";
import DeletePopup from "../../components/molecules/DeletePopup";
import ReportForm from "../../components/organisms/ReportForm/";
import classNames from "classnames";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import Paw from "../../components/atoms/Icons/Paw";
import Reviews from "../../components/organisms/Reviews";
import { useGetUserDetails } from "../../hooks/useGetUserDetails";
import { useAuthContext } from "../../hooks/useAuthContext";
import UsersPets from "../../components/organisms/UsersPets/UsersPets";

const Profile = () => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthContext();
  const { userDetails, avgRating, isUserLoading, userError } =
    useGetUserDetails(id);

  useEffect(() => {
    document.title = "Petix | Vartotojo profilis";
  }, []);

  const handleDelete = async (id) => {
    setIsDeleteLoading(true);
    const response = await fetch("/api/user/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      setIsDeleteLoading(false);
      setShowConfirmation(false);
      navigate("/");
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

  const handlePopupClose = () => {
    setShowReportForm(false);
  };

  return (
    <div className={styles.profile}>
      {showConfirmation && (
        <DeletePopup
          title="Ar tikrai norite ištrinti naudotoją?"
          onDelete={handleDelete}
          onClose={handleClose}
          id={idToDelete}
          isLoading={isDeleteLoading}
          error={deleteError}
        />
      )}
      {showReportForm && (
        <ReportForm
          onClose={handlePopupClose}
          username={
            userDetails.isOrganisation
              ? userDetails.organisationTitle
              : userDetails.username
          }
          user={userDetails._id}
          sender={user}
        />
      )}
      {isUserLoading ? (
        <LoadingSpinner />
      ) : userError ? (
        <p>{userError}</p>
      ) : (
        <div className={styles.profile__container}>
          <div className={styles.profile__left}>
            {userDetails._id !== user.id && !user.isAdmin && (
              <p
                className={styles.profile__report}
                onClick={() => setShowReportForm(!showReportForm)}
              >
                <ReportGmailerrorredIcon fontSize="large" /> Pranešti apie
                netinkamą veiklą.
              </p>
            )}

            <div
              className={classNames(styles.profile__picture, {
                [styles["profile__picture--verified"]]:
                  userDetails.isOrganisation,
              })}
            >
              <img
                src={
                  userDetails.userImage
                    ? `/Users/${userDetails.userImage}`
                    : "/Users/user-blank.png"
                }
                alt="Profile picture"
              />
              {userDetails.isOrganisation && (
                <div className={styles.profile__verified}>
                  <Paw />
                </div>
              )}
            </div>
            <h2 className={styles.profile__name}>
              {user.id === userDetails._id
                ? `Sveiki, ${
                    userDetails.isOrganisation && userDetails.organisationTitle
                      ? userDetails.organisationTitle
                      : userDetails.name
                  }`
                : userDetails.isOrganisation && userDetails.organisationTitle
                ? userDetails.organisationTitle
                : userDetails.username}
            </h2>
            {user.id === userDetails._id && (
              <>
                <p>
                  <b>Vartotojo vardas:</b> {userDetails.username}
                </p>
                <p>
                  <b>El. paštas:</b> {userDetails.email}
                </p>
                {userDetails.location && (
                  <p>
                    <b>Lokacija:</b> {userDetails.location.city}
                  </p>
                )}
              </>
            )}
            <p className={styles.profile__rating}>
              <b>Įvertinimas: </b>

              <Star isSmaller={true} isFilled={true} />
              {avgRating > 0
                ? `${avgRating}/5`
                : "Vartotojas dar neturi įvertinimų."}
            </p>
            {userDetails.isOrganisation && (
              <p>
                <b>Atstovaujama organizacija:</b>{" "}
                {userDetails.organisationTitle}
              </p>
            )}
            <p className={styles.profile__timestamp}>
              Vartotojas sukurtas{" "}
              {formatDistanceToNowStrict(new Date(userDetails.createdAt), {
                addSuffix: true,
                locale: lt,
              })}
              .
            </p>
            <Reviews currUser={user} userId={userDetails._id} />

            <div className={styles.profile__action}>
              {user.id === userDetails._id ? (
                <Link to={`/user/details/${userDetails._id}`}>
                  <Button style="lighter">Redaguoti profilį</Button>
                </Link>
              ) : (
                user.isAdmin && (
                  <Button
                    style="red"
                    onClick={() => handleShowConfirmation(userDetails._id)}
                  >
                    Panaikinti naudotoją
                  </Button>
                )
              )}
            </div>
          </div>
          <div className={styles.profile__right}>
            <UsersPets userDetails={userDetails} userId={id} user={user} />
          </div>
        </div>
      )}
      <div
        className={classNames({
          [styles["profile--overlay"]]: showConfirmation || showReportForm,
        })}
      ></div>
    </div>
  );
};

export default Profile;
