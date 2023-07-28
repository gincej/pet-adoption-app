import React, { useState, useEffect } from "react";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import { useGetUsersPets } from "../../../hooks/useGetUsersPets";
import getCoordDistance from "../../../utils/getCoordDistance";
import DeletePopup from "../../molecules/DeletePopup";
import classNames from "classnames";
import Pet from "../../molecules/Pet";
import styles from "./UsersPets.module.scss";

const UsersPets = ({ userDetails, userId, user }) => {
  const [petList, setPetList] = useState([]);
  const [idToDelete, setIdToDelete] = useState(0);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { userPets, petError, arePetsLoading } = useGetUsersPets(userId);

  useEffect(() => {
    if (userPets && userDetails) {
      let distanceList = getCoordDistance(userDetails, userPets);
      setPetList(distanceList);
    }
  }, [userPets]);

  const handleDelete = async (id) => {
    const response = await fetch("/api/pets/" + id, {
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
    <div className={styles.userpets}>
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
      <h3 className={styles.userpets__title}>Vartotojo gyvūnai</h3>
      {arePetsLoading ? (
        <LoadingSpinner />
      ) : petError ? (
        <p>{petError}</p>
      ) : petList.length === 0 ? (
        <p>Vartotojas dar nepridėjo skelbimų.</p>
      ) : (
        <div className={styles.userpets__container}>
          {petList.map((pet) => (
            <Pet
              key={pet._id}
              pet={pet}
              onDeletePet={() => handleShowConfirmation(pet._id)}
            />
          ))}
        </div>
      )}
      <div
        className={classNames({
          [styles["userpets--overlay"]]: showConfirmation,
        })}
      ></div>
    </div>
  );
};

export default UsersPets;
