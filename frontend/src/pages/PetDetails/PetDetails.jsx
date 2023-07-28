import React, { useState, useEffect } from "react";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import DeletePopup from "../../components/molecules/DeletePopup";
import { useGetSinglePet } from "../../hooks/useGetSinglePet";
import { lt } from "date-fns/locale";
import Like from "../../components/atoms/Icons/Like";
import Edit from "../../components/atoms/Icons/Edit";
import Delete from "../../components/atoms/Icons/Delete";
import Button from "../../components/atoms/Button";
import Comments from "../../components/organisms/Comments";
import classNames from "classnames";
import Carousel from "../../components/molecules/Carousel";
import ReservationForm from "../../components/organisms/ReservationForm";
import styles from "./PetDetails.module.scss";

const PetDetails = () => {
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { id } = useParams();
  const { petDetails, error, isLoading } = useGetSinglePet(id);

  useEffect(() => {
    document.title = "Petix | Augintinio skelbimas";
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch("/api/pets/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      setIsDeleteLoading(false);
      setShowConfirmation(false);
      !user.isAdmin && navigate("/", { state: { value: "mine" } });
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
    setShowForm(false);
  };

  return (
    <div className={styles.petprofile}>
      {showConfirmation && (
        <DeletePopup
          title="Ar tikrai norite ištrinti skelbimą?"
          onDelete={handleDelete}
          onClose={handleClose}
          id={idToDelete}
          isLoading={isDeleteLoading}
          error={deleteError}
        />
      )}
      {showForm && (
        <ReservationForm
          onClose={handlePopupClose}
          name={petDetails.name}
          pet={petDetails._id}
          owner={petDetails.author._id}
          user={user}
        />
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className={styles.petprofile__container}>
          <div className={styles.petprofile__left}>
            <h2 className={styles.petprofile__name}>{petDetails.name}</h2>
            <p className={styles.petprofile__description}>
              {petDetails.description}
            </p>
            <p>
              <span>Įkėlė </span>
              <Link to={`/user/${petDetails.author._id}`}>
                <b>
                  {petDetails.author.isOrganisation &&
                  petDetails.author.organisationTitle
                    ? petDetails.author.organisationTitle
                    : petDetails.author.username
                    ? petDetails.author.username
                    : petDetails.author.email}
                </b>
              </Link>
            </p>
            <p>
              <strong>Vietovė: </strong> {petDetails.location.city}
            </p>
            <p>
              <strong>Kategorija: </strong> {petDetails.category}
            </p>
            <p>
              <strong>Veislė: </strong> {petDetails.breed}
            </p>
            <p>
              <strong>Amžius: </strong> {petDetails.age}
            </p>
            <p>
              <strong>Lytis: </strong> {petDetails.gender}
            </p>
            <p>
              <strong>Kailio spalva: </strong> {petDetails.color}
            </p>
            {petDetails.furLength.length !== 0 && (
              <p>
                <strong>Kailio ilgis: </strong> {petDetails.furLength}
              </p>
            )}

            <div className={styles.petprofile__traits}>
              {petDetails.traits.map((trait) => (
                <p key={trait}>
                  <PetsRoundedIcon fontSize="large" />
                  {trait}
                </p>
              ))}
            </div>
            <p className={styles.petprofile__timestamp}>
              Įkelta{" "}
              {formatDistanceToNowStrict(new Date(petDetails.createdAt), {
                addSuffix: true,
                locale: lt,
              })}
              .
            </p>

            <div className={styles.petprofile__actions}>
              {user.id === petDetails.author._id || user?.isAdmin ? (
                <>
                  {!user?.isAdmin && (
                    <Link
                      to={`/edit/${petDetails._id}`}
                      className={styles.petprofile__edit}
                    >
                      <Edit />
                    </Link>
                  )}

                  <div
                    className={styles.petprofile__delete}
                    onClick={() => handleShowConfirmation(petDetails._id)}
                  >
                    <Delete />
                  </div>
                </>
              ) : (
                !user?.isAdmin && (
                  <>
                    <Button onClick={() => setShowForm(!showForm)}>
                      Siųsti globos užklausą
                    </Button>
                    <div className={styles.petprofile__favorite}>
                      <Like pet={petDetails} user={user} />
                    </div>
                  </>
                )
              )}
            </div>

            <Comments user={user} petId={id} />
          </div>
          <div className={styles.petprofile__right}>
            <Carousel pictures={petDetails?.pictures} />
          </div>
        </div>
      )}
      <div
        className={classNames({
          [styles["petprofile--overlay"]]: showForm || showConfirmation,
        })}
      ></div>
    </div>
  );
};

export default PetDetails;
