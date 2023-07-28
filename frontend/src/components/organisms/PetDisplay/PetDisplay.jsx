import React, { useState, useEffect } from "react";
import SidebarFilter from "../SidebarFilter";
import Pet from "../../molecules/Pet";
import styles from "./PetDisplay.module.scss";
import SortMenu from "../../atoms/SortMenu";
import getCoordDistance from "../../../utils/getCoordDistance";
import Button from "../../atoms/Button";
import { useNavigate } from "react-router-dom";

const PetDisplay = ({ petList, userDetails, onDelete, option }) => {
  const [dataCopy, setDataCopy] = useState([]);
  const [colorFilters, setColorFilters] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(0);
  const [ageFilters, setAgeFilters] = useState([]);
  const [breedFilters, setBreedFilters] = useState([]);
  const [lengthFilters, setLengthFilters] = useState([]);
  const [cityFilters, setCityFilters] = useState([]);
  const [organisationFilters, setOrganisationFilters] = useState([]);
  const [sortBy, setSortBy] = useState("dateASC");
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails && petList) {
      let listWithDistances = getCoordDistance(userDetails, petList);
      setDataCopy(listWithDistances);
    }
  }, [petList, userDetails]);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth <= 900 ? setIsMobile(true) : setIsMobile(false);
      window.innerWidth <= 900 ? setShowSidebar(false) : setShowSidebar(true);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFilterTemplate = (e, filterList, setNewList) => {
    const newValue = e.target.value;

    if (filterList.includes(newValue)) {
      setNewList(filterList.filter((option) => option !== newValue));
    } else {
      setNewList([...filterList, newValue]);
    }
    isMobile && setShowSidebar(false);
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
    setBreedFilters([]);
    setColorFilters([]);
    setOrganisationFilters([]);
    setLengthFilters([]);
    setCityFilters([]);
  };

  const handleDistanceFilter = (e) => {
    setDistanceFilter(e.target.value);
  };

  const handleBreedFilter = (e) => {
    handleFilterTemplate(e, breedFilters, setBreedFilters);
  };

  const handleAgeFilter = (e) => {
    handleFilterTemplate(e, ageFilters, setAgeFilters);
  };

  const handleColorFilter = (e) => {
    handleFilterTemplate(e, colorFilters, setColorFilters);
  };

  const handleLengthFilter = (e) => {
    handleFilterTemplate(e, lengthFilters, setLengthFilters);
  };

  const handleOrganisationFilter = (e) => {
    handleFilterTemplate(e, organisationFilters, setOrganisationFilters);
  };

  const handleCityFilter = (e) => {
    handleFilterTemplate(e, cityFilters, setCityFilters);
  };

  const handleReset = () => {
    setCategoryFilter("");
    setBreedFilters([]);
    setAgeFilters([]);
    setColorFilters([]);
    setLengthFilters([]);
    setOrganisationFilters([]);
    setDistanceFilter(0);
    setCityFilters([]);
  };

  const handleAgeCheck = (age) => {
    let number = age.split(" ")[0];
    let type = age.split(" ")[1];

    return (
      (ageFilters.includes("jaunas") && type === "Mėnesiai") ||
      (ageFilters.includes("vidutinis") && number <= 6 && type === "Metai") ||
      (ageFilters.includes("senas") && number > 6 && type === "Metai") ||
      ageFilters.length === 0 ||
      ageFilters.includes("")
    );
  };

  const handleDistanceCheck = (distance) => {
    return (
      distanceFilter === 0 ||
      distance <= distanceFilter ||
      (distanceFilter >= 500 && distance >= 500)
    );
  };

  const filteredData = dataCopy.filter((pet) => {
    return (
      (categoryFilter.length === 0 || categoryFilter === pet.category) &&
      (breedFilters.length === 0 ||
        breedFilters.includes(pet.breed) ||
        breedFilters.includes("")) &&
      (colorFilters.length === 0 ||
        colorFilters.includes(pet.color) ||
        colorFilters.includes("")) &&
      handleAgeCheck(pet.age) &&
      (organisationFilters.length === 0 ||
        organisationFilters.includes("") ||
        (organisationFilters.includes("organizacija") &&
          pet.author.isOrganisation) ||
        (organisationFilters.includes("privatus") &&
          !pet.author.isOrganisation)) &&
      (lengthFilters.length === 0 ||
        lengthFilters.includes("") ||
        lengthFilters.includes(pet.furLength)) &&
      handleDistanceCheck(pet.distance) &&
      (cityFilters.length === 0 ||
        cityFilters.includes("") ||
        cityFilters.includes(pet.location.city))
    );
  });

  const handleSort = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);

    let sortedPets = [...dataCopy];
    sortedPets.sort((a, b) => {
      switch (newSort) {
        case "dateASC":
          return a.createdAt < b.createdAt ? 1 : -1;
        case "dateDESC":
          return b.createdAt < a.createdAt ? 1 : -1;
        case "locASC":
          return a.distance > b.distance ? 1 : -1;
        case "locDESC":
          return b.distance > a.distance ? 1 : -1;
        default:
          return a.createdAt < b.createdAt ? 1 : -1;
      }
    });
    setDataCopy(sortedPets);
  };

  return (
    <div className={styles.display}>
      <SortMenu sortBy={sortBy} onSort={handleSort} />
      {isMobile && (
        <Button style="lighter" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? "Uždaryti" : "Filtravimas"}
        </Button>
      )}

      <div className={styles.display__main}>
        <SidebarFilter
          data={petList}
          selectedCategory={categoryFilter}
          distanceFilter={distanceFilter}
          breedFilters={breedFilters}
          colorFilters={colorFilters}
          ageFilters={ageFilters}
          cityFilters={cityFilters}
          lengthFilters={lengthFilters}
          organisationFilters={organisationFilters}
          onCategoryChange={handleCategoryFilter}
          onDistanceChange={handleDistanceFilter}
          onBreedChange={handleBreedFilter}
          onAgeChange={handleAgeFilter}
          onColorChange={handleColorFilter}
          onLengthChange={handleLengthFilter}
          onOrganisationChange={handleOrganisationFilter}
          onCityChange={handleCityFilter}
          onReset={handleReset}
          show={showSidebar}
        />

        <div className={styles.display__container}>
          {option === "mine" ? (
            <Button onClick={() => navigate("/add-pet")}>
              Pridėti naują skelbimą
            </Button>
          ) : (
            ""
          )}
          {option === "mine" ? (
            <h3 className={styles.display__title}>Mano augintiniai</h3>
          ) : (
            option === "liked" && (
              <h3 className={styles.display__title}>Pažymėti augintiniai</h3>
            )
          )}
          <div className={styles.display__pets}>
            {filteredData.length !== 0 ? (
              filteredData.map((pet) => (
                <Pet
                  key={pet._id}
                  pet={pet}
                  onDeletePet={() => onDelete(pet._id)}
                />
              ))
            ) : (
              <p>Paiešką atitinkančių skelbimų nerasta.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDisplay;
