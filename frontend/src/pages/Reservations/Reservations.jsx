import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import styles from "./Reservations.module.scss";
import Button from "../../components/atoms/Button";
import DeletePopup from "../../components/molecules/DeletePopup";
import InfoPopup from "../../components/atoms/InfoPopup";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useGetSentRequests } from "../../hooks/useGetSentRequests";
import { useGetReceivedRequests } from "../../hooks/useGetReceivedRequests";
import { useAuthContext } from "../../hooks/useAuthContext";

const Reservations = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { userReservations, userResError, isUserResLoading } =
    useGetSentRequests();
  const { receivedRequests, receivedReqError, areRequestsLoading } =
    useGetReceivedRequests();
  const { user } = useAuthContext();

  const handleClose = () => {
    setShowConfirmation(false);
  };

  const handleShowConfirmation = (id) => {
    setShowConfirmation(true);
    setIdToDelete(id);
  };

  useEffect(() => {
    document.title = "Petix | Rezervacijos";
  }, []);

  const handleDelete = async (id) => {
    setIsDeleteLoading(true);
    const response = await fetch("/api/pets/" + id, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      setIsDeleteLoading(false);
      setShowConfirmation(false);
      alert("Sandoris sėkmingai užbaigtas, skelbimas ištrintas.");
      window.location.reload();
    } else if (!response.ok) {
      setIsDeleteLoading(false);
      setDeleteError(json.error);
      alert(json.error);
    }
  };

  const handleReservation = async (e, id, petId) => {
    e.preventDefault();

    const response = await fetch(`api/request/reserve/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ petId }),
    });

    const json = await response.json();

    if (response.ok) {
      alert(json.message);
      window.location.reload();
    } else {
      alert(json.error);
    }
  };

  const handleCancel = async (e, id, petId) => {
    e.preventDefault();

    const response = await fetch(`/api/request/cancel/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ petId }),
    });

    const json = await response.json();

    if (response.ok) {
      alert(json.message);
      window.location.reload();
    } else {
      alert(json.error);
    }
  };

  const handleRemoveRequest = async (e, id, petId) => {
    e.preventDefault();

    const response = await fetch(`/api/request/remove/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ petId }),
    });

    const json = await response.json();

    if (response.ok) {
      alert(json.message);
      window.location.reload();
    } else {
      alert(json.error);
    }
  };

  return (
    <div className={styles.reservations}>
      {showConfirmation && (
        <DeletePopup
          title="Ar tikrai norite užbaigti sandorį? Patvirtinus, skelbimas bus ištrinamas."
          onDelete={handleDelete}
          onClose={handleClose}
          id={idToDelete}
          isLoading={isDeleteLoading}
          error={deleteError}
        />
      )}
      <h2 className={styles.reservations__heading}>Rezervacijos </h2>
      <div className={styles.reservations__content}>
        <div className={styles.reservations__left}>
          <div className={styles.reservations__container}>
            <h3 className={styles.reservations__title}>
              Mano išsiųstos užklausos
            </h3>
            {isUserResLoading ? (
              <LoadingSpinner />
            ) : userResError ? (
              <p>{userResError}</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Gyvūnas</th>
                    <th>Savininkas</th>
                    <th>Kontaktai</th>
                    <th>Statusas</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {userReservations.map((res) => (
                    <tr key={res._id}>
                      <td className={styles.reservations__petname}>
                        <Link to={`/pets/${res.pet._id}`}>{res.pet.name}</Link>
                      </td>
                      <td>
                        <Link to={`/user/${res.owner._id}`}>
                          {res.owner.isOrganisation
                            ? res.owner.organisationTitle
                            : res.owner.username}
                        </Link>
                      </td>
                      <td className={styles.reservations__contacts}>
                        {res.pet.contacts}
                      </td>
                      <td>{res.status}</td>
                      <td>
                        <div className={styles.reservations__buttons}>
                          <Button
                            style="red"
                            onClick={(e) =>
                              handleRemoveRequest(e, res._id, res.pet._id)
                            }
                            disabled={
                              res.status === "Atmesta" ||
                              res.status === "Atšaukta kandidato"
                            }
                          >
                            Atšaukti
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className={styles.reservations__right}>
          <h3 className={styles.reservations__title}>Gautos užklausos</h3>
          {areRequestsLoading ? (
            <LoadingSpinner />
          ) : receivedReqError ? (
            <p>{receivedReqError}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Gyvūnas</th>
                  <th>Kandidatas</th>
                  <th>Žinutė</th>
                  <th>Statusas</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {receivedRequests.map((res) => (
                  <tr key={res._id}>
                    <td className={styles.reservations__petname}>
                      <Link to={`/pets/${res.pet._id}`}>{res.pet.name}</Link>
                    </td>
                    <td>
                      <Link to={`/user/${res.sender._id}`}>
                        {res.sender.isOrganisation
                          ? res.sender.organisationTitle
                          : res.sender.username}
                      </Link>
                    </td>
                    <td className={styles.reservations__contacts}>
                      {res.text}
                    </td>
                    <td>{res.status}</td>
                    <td>
                      <div className={styles.reservations__buttons}>
                        {res.status !== "Atšaukta kandidato" &&
                          res.status !== "Atmesta" && (
                            <>
                              {res.status !== "Priimta" && (
                                <Button
                                  style="outlined"
                                  onClick={(e) =>
                                    handleReservation(e, res._id, res.pet._id)
                                  }
                                >
                                  Rezervuoti
                                </Button>
                              )}

                              <Button
                                style="red"
                                onClick={(e) =>
                                  handleCancel(e, res._id, res.pet._id)
                                }
                              >
                                Atmesti
                              </Button>
                            </>
                          )}

                        {res.status === "Priimta" && (
                          <Button
                            onClick={() => handleShowConfirmation(res.pet._id)}
                          >
                            Patvirtinti sandorį
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div
        className={classNames({
          [styles["reservations--overlay"]]: showConfirmation,
        })}
      ></div>
    </div>
  );
};

export default Reservations;
