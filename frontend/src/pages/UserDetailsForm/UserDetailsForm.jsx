import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useGetUserDetails } from "../../hooks/useGetUserDetails";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import CitySelect from "../../components/atoms/CitySelect";
import Button from "../../components/atoms/Button";
import classNames from "classnames";
import styles from "./UserDetailsForm.module.scss";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const UserDetailsForm = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    city: "",
  });
  const [isOrganisation, setIsOrganisation] = useState("");
  const [organisationTitle, setOrganisationTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [picturePreview, setPicturePreview] = useState(null);
  const [postError, setPostError] = useState("");
  const [locationError, setLocationError] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  const { user } = useAuthContext();
  const { id } = useParams();
  const { userDetails, isUserLoading, userError } = useGetUserDetails(id);
  const navigate = useNavigate();

  if (user.id !== id) {
    window.location = "/user/details/" + user.id;
  }

  useEffect(() => {
    document.title = "Petix | Vartotojo informacija";
    if (userDetails) {
      userDetails.location && setLocation(userDetails.location);
      setIsOrganisation(userDetails.isOrganisation);
      setOrganisationTitle(
        userDetails.organisationTitle ? userDetails.organisationTitle : ""
      );
    }
  }, [userDetails]);

  const handleGetLocation = () => {
    setIsLocationLoading(true);
    const success = (position) => {
      const latitude = position.coords.latitute;
      const longitude = position.coords.longitude;
      fetchLocation(latitude, longitude);
    };
    const error = () => {
      setLocationError("Vietovė nepasiekiama.");
      setIsLocationLoading(false);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  };

  const fetchLocation = async (latitude, longitude) => {
    const locationAPI = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=lt`;

    const response = await fetch(locationAPI);

    const json = await response.json();

    if (response.ok) {
      setLocation({
        latitude: json.latitude,
        longitude: json.longitude,
        city: json.city,
      });
      setIsLocationLoading(false);
    } else {
      setLocationError(json.error);
      setIsLocationLoading(false);
    }
  };

  const handleFileAdd = (e) => {
    const file = e.target.files[0];
    if (!file.type.includes("image/")) {
      alert("Netinkamas failo formatas!");
      return;
    }
    setFileName(file);
    if (file) {
      setPicturePreview(URL.createObjectURL(file));
    } else {
      setPicturePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("location", JSON.stringify(location));
    formData.append("isOrganisation", isOrganisation);
    formData.append("organisationTitle", organisationTitle);
    formData.append("userImage", fileName);

    const response = await fetch(`/api/user/${id}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setPostError(json.error);
    }

    if (response.ok) {
      navigate(`/user/${json._id}`);
    }
  };

  const handleSelect = async (value) => {
    const result = await geocodeByAddress(value);
    const latLng = await getLatLng(result[0]);
    const city = result[0]["formatted_address"].split(",")[0];

    setLocation({
      latitude: latLng.lat,
      longitude: latLng.lng,
      city: city,
    });
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className={styles.userform}>
      {isUserLoading ? (
        <LoadingSpinner />
      ) : userError ? (
        <p>{userError}</p>
      ) : (
        <div className={styles.userform__container}>
          {!userDetails && (
            <h3 className={styles.userform__subtitle}>
              Sveiki, {userDetails.name}
            </h3>
          )}
          <h2 className={styles.userform__title}>Vartotojo informacija</h2>
          <form className={styles.userform__form} onSubmit={handleSubmit}>
            <div>
              <label>Jūsų lokacija*:</label>

              <p>
                *skirta surasti atitinkamus gyvūnų skelbimus. Ji nebus skelbiama
                viešai.
              </p>
              {isLocationLoading ? (
                <LoadingSpinner />
              ) : locationError && !location.city ? (
                locationError
              ) : (
                <span>{location?.city}</span>
              )}
              <div className={styles.userform__location}>
                <CitySelect onSelect={handleSelect} />
                <p>arba</p>
                <Button type="button" onClick={handleGetLocation}>
                  Nustatyti vietą
                </Button>
              </div>
            </div>
            <div
              className={classNames(styles.userform__org, {
                [styles["userform__org--disabled"]]: !isOrganisation,
              })}
            >
              <div>
                <label>Aš atstovauju organizaciją:</label>
                <input
                  type="checkbox"
                  onChange={() => {
                    setIsOrganisation(!isOrganisation);
                    setOrganisationTitle("");
                  }}
                  checked={isOrganisation}
                />
              </div>
              <input
                placeholder="Įveskite organizacijos pavadinimą"
                disabled={!isOrganisation}
                type="text"
                onChange={(e) => setOrganisationTitle(e.target.value)}
                value={organisationTitle}
                className={styles.userform__inputdisabled}
              />
            </div>
            <div className={styles.userform__picture}>
              <label>Pridėkite profilio nuotrauką:</label>
              <input
                id="fileInput"
                type="file"
                name="userImage"
                accept="image/*"
                onChange={handleFileAdd}
              />
              <Button type="button" onClick={handleButtonClick}>
                Pridėti failą
              </Button>
              {picturePreview && (
                <img
                  src={picturePreview}
                  alt="picture preview"
                  className={styles.userform__preview}
                />
              )}
            </div>
            <div className={styles.userform__buttons}>
              <Button
                style="lighter"
                disabled={Object.values(location).some(
                  (value) =>
                    value === "" || value === null || value === undefined
                )}
              >
                Patvirtinti
              </Button>
              {userDetails.location && (
                <Button
                  type="button"
                  style="outlined"
                  onClick={() => navigate("/")}
                >
                  Atšaukti
                </Button>
              )}
            </div>
            {postError && (
              <div className={styles.userform__error}> {postError}</div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDetailsForm;
