import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import LoadingSpinner from "../../components/atoms/LoadingSpinner";
import { useGetSinglePet } from "../../hooks/useGetSinglePet";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import CitySelect from "../../components/atoms/CitySelect";
import styles from "./PetForm.module.scss";
import Button from "../../components/atoms/Button";
import validate from "../../utils/validate";
import classNames from "classnames";

const PetForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [color, setColor] = useState("");
  const [furLength, setFurLength] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [traits, setTraits] = useState([]);
  const [contacts, setContacts] = useState("");
  const [location, setLocation] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [postError, setPostError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);

  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const unitSelectRef = useRef(null);
  const typeSelectRef = useRef(null);

  const { petDetails, isLoading, error } = useGetSinglePet(id);

  useEffect(() => {
    document.title = "Petix | Naujas skelbimas";
    const fetchCategories = async () => {
      setIsDataLoading(true);
      const response = await fetch("/api/category", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setCategoryData(json);
        setIsDataLoading(false);
      }

      if (!response.ok) {
        setIsDataLoading(false);
        setDataError(json.error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (petDetails) {
      document.title = "Petix | Skelbimo redagavimas";
      setBreed(petDetails.breed);
      setCategory(petDetails.category);
      setColor(petDetails.color);
      setAge(petDetails.age);
      setLocation(petDetails.location);
      setDescription(petDetails.description);
      setContacts(petDetails.contacts);
      setTraits(petDetails.traits);
      setFurLength(petDetails.furLength);
      setGender(petDetails.gender);
      setName(petDetails.name);
      Promise.all(
        petDetails.pictures.map((picture) => {
          const url = `/Pets/${picture}`;
          return fetch(url)
            .then((res) => res.blob())
            .then((blob) => new File([blob], picture, { type: blob.type }));
        })
      ).then((pictureList) => {
        setPictures([...pictureList]);
      });
    }
  }, [petDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPet = {
      name,
      category,
      breed,
      age,
      color,
      gender,
      description,
      contacts,
      traits,
      furLength,
      location,
      pictures,
    };

    const validateFields = validate(newPet);
    setEmptyFields(validateFields);

    if (validateFields.length === 0) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("breed", breed);
      formData.append("age", age);
      formData.append("color", color);
      formData.append("gender", gender);
      formData.append("description", description);
      formData.append("contacts", contacts);
      formData.append("furLength", furLength);
      formData.append("traits", JSON.stringify(traits));
      for (let i = 0; i < pictures.length; i++) {
        formData.append("petImages", pictures[i]);
      }
      formData.append("location", JSON.stringify(location));

      const response = await fetch(id ? `/api/pets/${id}` : "/api/pets", {
        method: id ? "PATCH" : "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setPostError(json.error);
        json.emptyFields && setEmptyFields(json.emptyFields);
      }

      if (response.ok) {
        navigate(`/pets/${json._id}`);
      }
    }
  };

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

  const handleAgeChange = (e) => {
    const { name } = e.target;

    let newAge = "";
    let newType = "";

    if (name === unitSelectRef.current.name) {
      newAge = unitSelectRef.current.value;
      newType = typeSelectRef.current.value;
    }
    if (name === typeSelectRef.current.name) {
      newAge = unitSelectRef.current.value;
      newType = typeSelectRef.current.value;
    }

    const combinedValue = `${newAge} ${newType}`;

    setAge(combinedValue);
  };

  function handleCheckboxChange(event) {
    const { value, checked } = event.target;
    if (checked) {
      setTraits((prevCheckedValues) => [...prevCheckedValues, value]);
    } else {
      setTraits((prevCheckedValues) =>
        prevCheckedValues.filter((v) => v !== value)
      );
    }
  }

  const handleFileAdd = (e) => {
    const files = [...e.target.files];
    if (files.some((f) => !f.type.includes("image/"))) {
      alert("Netinkamas failo formatas!");
      return;
    }
    if (files.length > 3 - pictures.length) {
      alert("Įkelkite iki 3 nuotraukų!");
      e.target.value = null;
      return;
    }
    setPictures([...pictures, ...files]);
  };

  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleCancel = (i) => {
    const newPics = [...pictures];
    newPics.splice(i, 1);
    setPictures(newPics);
  };

  return (
    <div className={styles.petform}>
      {isLoading || isDataLoading ? (
        <LoadingSpinner />
      ) : id && error ? (
        <p>{error}</p>
      ) : (
        <div className={styles.petform__container}>
          {id ? (
            <h3 className={styles.petform__title}>Redaguoti skelbimą</h3>
          ) : (
            <h3 className={styles.petform__title}>Naujas gyvūno skelbimas</h3>
          )}
          <form className={styles.petform__form} onSubmit={handleSubmit}>
            <div className={styles.petform__group}>
              <div className={styles.petform__input}>
                <label>Gyvūno vardas - skelbimo pavadinimas:</label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="Įveskite gyvūno vardą ar skelbimo pavadinimą"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={
                    emptyFields.includes("name")
                      ? styles.petform__inputerror
                      : ""
                  }
                />
              </div>
            </div>
            <div className={styles.petform__group}>
              <div className={styles.petform__input}>
                <label>Kategorija:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={
                    emptyFields.includes("category")
                      ? styles.petform__inputerror
                      : ""
                  }
                >
                  <option value="" disabled>
                    Pasirinkite kategoriją
                  </option>
                  {categoryData.map((category) => (
                    <option value={category.animal} key={category.animal}>
                      {category.animal}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.petform__input}>
                <label>Veislė:</label>
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className={
                    emptyFields.includes("breed")
                      ? styles.petform__inputerror
                      : ""
                  }
                >
                  <option value="" disabled>
                    Pasirinkite veislę
                  </option>
                  {categoryData
                    ?.find((c) => c.animal === category)
                    ?.breeds.map((breed) => (
                      <option key={breed}>{breed}</option>
                    ))}
                </select>
              </div>
            </div>
            <div className={styles.petform__group}>
              <div className={styles.petform__input}>
                <label>Amžius:</label>
                <div className={styles.petform__age}>
                  <select
                    value={age && age.split(" ")[0]}
                    name="number"
                    onChange={handleAgeChange}
                    ref={unitSelectRef}
                    className={
                      emptyFields.includes("age")
                        ? styles.petform__inputerror
                        : ""
                    }
                  >
                    <option value="" disabled>
                      Pasirinkite amžių
                    </option>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <select
                    value={age && age.split(" ")[1]}
                    name="type"
                    onChange={handleAgeChange}
                    ref={typeSelectRef}
                    className={
                      emptyFields.includes("age")
                        ? styles.petform__inputerror
                        : ""
                    }
                  >
                    <option value="" disabled>
                      {"Pasirinkite tipą"}
                    </option>
                    <option>Mėnesiai</option>
                    <option>Metai</option>
                  </select>
                </div>
              </div>
              <div className={styles.petform__input}>
                <label>Lytis:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={
                    emptyFields.includes("gender")
                      ? styles.petform__inputerror
                      : ""
                  }
                >
                  <option value="" disabled>
                    Pasirinkite lytį
                  </option>
                  <option>Patinas</option>
                  <option>Patelė</option>
                </select>
              </div>
            </div>
            <div className={styles.petform__group}>
              <div className={styles.petform__input}>
                <label>Kailio ilgis:</label>
                <select
                  value={furLength}
                  disabled={
                    categoryData?.find((c) => c.animal === category)?.lengths
                      .length === 0
                  }
                  onChange={(e) => setFurLength(e.target.value)}
                  className={
                    emptyFields.includes("length") &&
                    categoryData?.find((c) => c.animal === category)?.lengths
                      .length !== 0
                      ? styles.petform__inputerror
                      : ""
                  }
                >
                  <option value="" disabled>
                    Pasirinkite kailio ilgį
                  </option>
                  {categoryData
                    ?.find((c) => c.animal === category)
                    ?.lengths.map((length) => (
                      <option key={length}>{length}</option>
                    ))}
                </select>
              </div>
              <div className={styles.petform__input}>
                <label>Spalva:</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={
                    emptyFields.includes("color")
                      ? styles.petform__inputerror
                      : ""
                  }
                >
                  {" "}
                  <option value="" disabled>
                    Pasirinkite spalvą
                  </option>
                  {categoryData
                    ?.find((c) => c.animal === category)
                    ?.colors.map((color) => (
                      <option key={color}>{color}</option>
                    ))}
                </select>
              </div>
            </div>
            <div className={styles.petform__group}>
              <div className={styles.petform__input}>
                <label>Pridėkite augintinio aprašą:</label>
                <textarea
                  maxLength={500}
                  placeholder="Trumpai pristatykite dovanojamą augintinį (paminėkite formoje nepateiktas charakteristikas)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={
                    emptyFields.includes("description")
                      ? styles.petform__inputerror
                      : ""
                  }
                />
              </div>
            </div>
            <div className={styles.petform__group}>
              <div className={styles.petform__input}>
                <label
                  className={
                    emptyFields.includes("traits")
                      ? styles.petform__inputerror
                      : ""
                  }
                >
                  Pasirinkite augintinio savybes:
                </label>
                <div className={styles.petform__traits}>
                  {categoryData
                    ?.find((c) => c.animal === category)
                    ?.traits.map((trait) => {
                      return (
                        <label key={trait}>
                          <input
                            type="checkbox"
                            value={trait}
                            checked={traits.includes(trait)}
                            onChange={handleCheckboxChange}
                          />
                          {trait}
                        </label>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className={styles.petform__group}>
              <div className={styles.petform__input}>
                <label
                  className={
                    emptyFields.includes("location")
                      ? styles.petform__inputerror
                      : ""
                  }
                >
                  Vietovė:
                </label>
                {isLocationLoading ? (
                  <LoadingSpinner />
                ) : locationError && !location.city ? (
                  locationError
                ) : (
                  <span> {location?.city}</span>
                )}
                <div className={styles.petform__location}>
                  <CitySelect onSelect={handleSelect} />
                  <p>arba</p>
                  <Button
                    type="button"
                    style="lighter"
                    onClick={handleGetLocation}
                  >
                    Nustatyti vietą
                  </Button>
                </div>
              </div>
            </div>
            <div className={styles.petform__group}>
              <div
                className={classNames(
                  styles.petform__input,
                  styles.petform__pictures
                )}
              >
                <label
                  className={
                    emptyFields.includes("pictures")
                      ? styles.petform__inputerror
                      : ""
                  }
                >
                  Pridėkite augintinio nuotraukų:
                </label>
                <span>Pridėkite iki 3 nuotraukų</span>
                <input
                  type="file"
                  id="fileInput"
                  name="petImages"
                  accept="image/*"
                  multiple
                  onChange={handleFileAdd}
                />
                <Button
                  type="button"
                  onClick={handleButtonClick}
                  disabled={pictures.length >= 3}
                >
                  Pridėti nuotraukų
                </Button>
                <div className={styles.petform__pictureList}>
                  {pictures.map((picture, index) => (
                    <div
                      key={picture.name}
                      className={styles.petform__pictureContainer}
                    >
                      <img
                        src={
                          petDetails?.pictures.includes(picture.name)
                            ? `/Pets/${picture.name}`
                            : URL.createObjectURL(picture)
                        }
                        alt={picture.name}
                      />
                      <Button
                        type="button"
                        style="outlined"
                        onClick={() => handleCancel(index)}
                      >
                        Panaikinti
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.petform__group}>
              <div className={styles.petform__input}>
                <label>Jūsų kontaktai:</label>
                <textarea
                  maxLength={200}
                  placeholder="Įveskite savo tel. numerį, el. paštą ir/ar socialinių tinklų nuorodas."
                  value={contacts}
                  onChange={(e) => setContacts(e.target.value)}
                  className={
                    emptyFields.includes("contacts")
                      ? styles.petform__inputerror
                      : ""
                  }
                />
              </div>
            </div>
            <div className={styles.petform__buttons}>
              {id ? <Button>Redaguoti</Button> : <Button>Pridėti</Button>}
              <Button
                type="button"
                style="outlined"
                onClick={() => (window.location.href = "/")}
              >
                Atšaukti
              </Button>
            </div>
            {postError && (
              <div className={styles.petform__error}>{postError}</div>
            )}
            {emptyFields.length !== 0 && (
              <div className={styles.petform__error}>
                Užpildykite visus laukus.
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default PetForm;
