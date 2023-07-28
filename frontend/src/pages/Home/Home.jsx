import PetDisplay from "../../components/organisms/PetDisplay";
import { useGetAllPets } from "../../hooks/useGetAllPets";
import { useGetUserDetails } from "../../hooks/useGetUserDetails";
import { useAuthContext } from "../../hooks/useAuthContext";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import HomeMenu from "../../components/atoms/HomeMenu";
import classNames from "classnames";
import styles from "./Home.module.scss";
import InfoPopup from "../../components/atoms/InfoPopup";
import DeletePopup from "../../components/molecules/DeletePopup";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [pets, setPets] = useState([]);
  const [option, setOption] = useState("all");
  const [idToDelete, setIdToDelete] = useState(0);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { userDetails, isUserLoading, userError } = useGetUserDetails(user.id);
  const { petList, arePetsLoading, petsError } = useGetAllPets(user);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (loggedUser?.alert) {
      setShowAlert(true);
      setAlert(loggedUser.alert);
    }
  }, []);

  useEffect(() => {
    let newList = [];

    if (petList) {
      if (option === "all") {
        newList = petList.filter((pet) => pet.author._id !== user.id);
        document.title = "Petix | Visi skelbimai";
      } else if (option === "mine") {
        newList = petList.filter((pet) => pet.author._id === user.id);
        document.title = "Petix | Mano skelbimai";
      } else if (option === "liked") {
        newList = petList.filter((pet) =>
          pet.likes.some((like) => like._id === user.id)
        );
        document.title = "Petix | Pažymėti skelbimai";
      }
      setPets(newList);
    }
  }, [petList, option]);

  useEffect(() => {
    if (location.state) {
      handleOptionChange(location.state.value);
    }
  }, [location]);

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
      window.location.reload();
    } else if (!response.ok) {
      setIsDeleteLoading(false);
      setDeleteError(json.error);
    }
  };

  const handleOptionChange = (newOption) => {
    setOption(newOption);
  };

  const handleClose = () => {
    setShowConfirmation(false);
  };

  const handleShowConfirmation = (id) => {
    setShowConfirmation(true);
    setIdToDelete(id);
  };

  const handleAlertClose = async () => {
    const response = await fetch(`/api/user/removealert/${user.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    if (!response.ok) {
      window.alert(json.error);
    }

    if (response.ok) {
      const loggedUser = JSON.parse(localStorage.getItem("user"));
      loggedUser.alert = "";
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setShowAlert(false);
    }
  };

  return (
    <div className="home">
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
      {showAlert && <InfoPopup onClose={handleAlertClose} alert={alert} />}
      {!user?.isAdmin && (
        <HomeMenu option={option} onOptionChange={handleOptionChange} />
      )}
      {isUserLoading || arePetsLoading ? (
        <LoadingSpinner />
      ) : userError ? (
        <p>{userError}</p>
      ) : petsError ? (
        <p>{petsError}</p>
      ) : (
        <PetDisplay
          option={option}
          userDetails={userDetails}
          petList={pets}
          onDelete={handleShowConfirmation}
        />
      )}
      <div
        className={classNames({
          [styles["home--overlay"]]: showConfirmation || showAlert,
        })}
      ></div>
    </div>
  );
};

export default Home;
