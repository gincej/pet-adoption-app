import React, { useState, useEffect } from "react";
import styles from "./SidebarFilter.module.scss";
import classNames from "classnames";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Button from "../../atoms/Button";

const SidebarFilter = (props) => {
  const {
    data,
    selectedCategory,
    distanceFilter,
    breedFilters,
    ageFilters,
    colorFilters,
    lengthFilters,
    cityFilters,
    organisationFilters,
    onCategoryChange,
    onDistanceChange,
    onBreedChange,
    onAgeChange,
    onCityChange,
    onColorChange,
    onLengthChange,
    onOrganisationChange,
    onReset,
    show,
  } = props;

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuthContext();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const response = await fetch("/api/category", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setCategories(json);
        setIsLoading(false);
      }

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
      }
    };
    fetchCategories();
  }, []);

  const getCategories = () => {
    let animals = [];
    categories.map((pet) => {
      animals.push(pet.animal);
    });
    return animals;
  };

  const getBreeds = () => {
    let breeds = [];
    if (selectedCategory) {
      categories
        .find((c) => c.animal === selectedCategory)
        ?.breeds.filter((breed) => data.some((pet) => pet.breed === breed))
        .map((breed) => {
          breeds.push(breed);
        });
    } else {
      breeds = [...new Set(data?.map((pet) => pet.breed))];
    }
    return breeds;
  };

  const getColors = () => {
    let colors = [];
    if (selectedCategory) {
      categories
        .find((c) => c.animal === selectedCategory)
        .colors.filter((color) =>
          data.some(
            (pet) => pet.category === selectedCategory && pet.color === color
          )
        )
        .map((color) => {
          colors.push(color);
        });
    } else {
      colors = [...new Set(data?.map((pet) => pet.color))];
    }
    return colors;
  };

  const getLengths = () => {
    let lengths = [];
    if (selectedCategory) {
      categories
        .find((c) => c.animal === selectedCategory)
        .lengths.filter((length) =>
          data.some(
            (pet) =>
              pet.category === selectedCategory && pet.furLength === length
          )
        )
        .map((length) => {
          lengths.push(length);
        });
    } else {
      lengths = [...new Set(data?.map((pet) => pet.furLength))];
    }
    return lengths;
  };

  const getCities = () => {
    let cities = [];
    if (selectedCategory) {
      cities = [
        ...new Set(
          data
            .filter((pet) => pet.category === selectedCategory)
            .map((pet) => pet.location.city)
        ),
      ];
    } else {
      cities = [...new Set(data?.map((pet) => pet.location.city))];
    }
    return cities;
  };

  const checkboxInput = (title, optionList, filterList, changeFunction) => {
    return (
      optionList.length !== 0 && (
        <div className={styles.sidebar__category}>
          <h4>{title}:</h4>
          {optionList.map((option) => (
            <div className={styles.sidebar__option} key={option}>
              {option.length !== 0 && (
                <label>
                  <input
                    type="checkbox"
                    value={option}
                    checked={filterList.includes(option)}
                    onChange={changeFunction}
                  />
                  {option}
                </label>
              )}
            </div>
          ))}
        </div>
      )
    );
  };

  return (
    <aside
      className={classNames(styles.sidebar, {
        [styles["sidebar--mobile"]]: !show,
      })}
    >
      <Button type="lighter" onClick={onReset}>
        Išvalyti filtrus
      </Button>
      <h3 className={styles.sidebar__title}>Filtruoti pagal:</h3>
      <div className={styles.sidebar__category}>
        <h4>Kategorija:</h4>
        <select onChange={onCategoryChange} value={selectedCategory}>
          <option value="" disabled defaultValue={""}>
            Pasirinkite kategoriją
          </option>
          {getCategories().map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.sidebar__category}>
        <div className={styles.sidebar__distance}>
          <h4>Maksimalus atstumas:</h4>{" "}
          <p>{distanceFilter ? `${distanceFilter} km.` : ""}</p>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          value={distanceFilter}
          onChange={onDistanceChange}
        />
      </div>
      {checkboxInput("Miestas", getCities(), cityFilters, onCityChange)}
      {checkboxInput("Veislė", getBreeds(), breedFilters, onBreedChange)}
      <div className={styles.sidebar__category}>
        <h4>Amžius:</h4>
        <div className={styles.sidebar__option}>
          <label>
            <input
              type="checkbox"
              value="jaunas"
              checked={ageFilters.includes("jaunas")}
              onChange={onAgeChange}
            />
            Jaunas (iki 1m.)
          </label>
        </div>
        <div className={styles.sidebar__option}>
          <label>
            <input
              type="checkbox"
              value="vidutinis"
              checked={ageFilters.includes("vidutinis")}
              onChange={onAgeChange}
            />
            Vidutinio amžiaus (1-6m.)
          </label>
        </div>
        <div className={styles.sidebar__option}>
          <label>
            <input
              type="checkbox"
              value="senas"
              checked={ageFilters.includes("senas")}
              onChange={onAgeChange}
            />
            Senas (6m. +)
          </label>
        </div>
      </div>
      <div className={styles.sidebar__category}>
        <h4>Savininkas:</h4>
        <div className={styles.sidebar__option}>
          <label>
            <input
              type="checkbox"
              value="organizacija"
              checked={organisationFilters.includes("organizacija")}
              onChange={onOrganisationChange}
            />
            Organizacija
          </label>
        </div>
        <div className={styles.sidebar__option}>
          <label>
            <input
              type="checkbox"
              value="privatus"
              checked={organisationFilters.includes("privatus")}
              onChange={onOrganisationChange}
            />
            Privatus asmuo
          </label>
        </div>
      </div>
      {checkboxInput("Spalva", getColors(), colorFilters, onColorChange)}

      {checkboxInput(
        "Kailio ilgis",
        getLengths(),
        lengthFilters,
        onLengthChange
      )}
    </aside>
  );
};

export default SidebarFilter;
