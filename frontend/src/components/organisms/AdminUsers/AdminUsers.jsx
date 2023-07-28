import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeletePopup from "../../molecules/DeletePopup";
import AlertForm from "../../molecules/AlertForm";
import styles from "./AdminUsers.module.scss";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import classNames from "classnames";
import { useGetAllUsers } from "../../../hooks/useGetAllUsers";
import { useAuthContext } from "../../../hooks/useAuthContext";

const AdminUsers = () => {
  const [showForm, setShowForm] = useState(false);
  const [userToAlert, setUserToAlert] = useState(0);
  const [idToDelete, setIdToDelete] = useState(0);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { userList, areUsersLoading, userError } = useGetAllUsers(user);

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
      navigate("/admin-panel", { state: { value: "user-list" } });
      window.location.reload();
    } else if (!response.ok) {
      setIsDeleteLoading(false);
      setDeleteError(json.error);
    }
  };

  const sortByRating = (list) => {
    const noRatings = [...list].filter((r) => r.averageRating === 0);
    const withRatings = [...list].filter((r) => r.averageRating !== 0);
    const sortedItems = [...withRatings].sort(
      (a, b) => a.averageRating - b.averageRating
    );
    return sortedItems.concat(noRatings);
  };

  const handleShowForm = (id) => {
    setShowForm(true);
    setUserToAlert(id);
  };

  const handleClose = () => {
    setShowConfirmation(false);
  };

  const handleShowConfirmation = (id) => {
    setShowConfirmation(true);
    setIdToDelete(id);
  };

  return (
    <div className={styles.users}>
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
      {showForm && (
        <AlertForm
          user={user}
          onClose={() => setShowForm(false)}
          userId={userToAlert}
        />
      )}
      <h3>Sistemos naudotojai</h3>
      {areUsersLoading ? (
        <LoadingSpinner />
      ) : userError ? (
        <p>{userError}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Naudotojas</th>
              <th>Įvertinimas</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {sortByRating(userList)
              .filter((sysuser) => sysuser._id !== user.id)
              .map((sysuser) => (
                <tr key={sysuser._id}>
                  <td>
                    <Link
                      to={`/user/${sysuser._id}`}
                      className={styles.users__name}
                    >
                      {sysuser.isOrganisation && sysuser.organisationTitle
                        ? sysuser.organisationTitle
                        : sysuser.username}
                    </Link>
                  </td>
                  <td>
                    {sysuser.averageRating !== 0
                      ? `${sysuser.averageRating}/5`
                      : "Nėra įvertinimų"}
                  </td>
                  <td>
                    <table className={styles.users__actions}>
                      <tbody>
                        <tr>
                          <td>
                            {!sysuser.alert ? (
                              <p
                                onClick={() => handleShowForm(sysuser._id)}
                                className={classNames(
                                  styles.users__alert,
                                  styles["users__alert--button"]
                                )}
                              >
                                Siųsti perspėjimą
                              </p>
                            ) : (
                              <p className={styles.users__alert}>
                                Naudotojas dar neperskaitė perspėjimo
                              </p>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p
                              onClick={() =>
                                handleShowConfirmation(sysuser._id)
                              }
                              className={styles.users__delete}
                            >
                              Ištrinti naudotoją
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <div
        className={classNames({
          [styles["users--overlay"]]: showConfirmation || showForm,
        })}
      ></div>
    </div>
  );
};

export default AdminUsers;
