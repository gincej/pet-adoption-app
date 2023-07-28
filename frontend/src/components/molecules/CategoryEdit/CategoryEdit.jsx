import React, { useState } from "react";
import Button from "../../atoms/Button";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import styles from "./CategoryEdit.module.scss";
import Add from "../../atoms/Icons/Add";

const CategoryEdit = ({ user, category, onClose }) => {
  const [breeds, setBreeds] = useState(category.breeds);
  const [traits, setTraits] = useState(category.traits);
  const [lengths, setLengths] = useState(category.lengths);
  const [colors, setColors] = useState(category.colors);
  const [error, setError] = useState(null);

  const [breedInput, setBreedInput] = useState("");
  const [traitInput, setTraitInput] = useState("");
  const [lengthInput, setLengthInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/category/${category._id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ breeds, traits, lengths, colors }),
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      onClose();
      window.location.reload();
    }
  };

  const addItem = (list, value) => {
    if (value) {
      switch (list) {
        case "breeds":
          setBreeds([...breeds, value]);
          setBreedInput("");
          break;
        case "traits":
          setTraits([...traits, value]);
          setTraitInput("");
          break;
        case "lengths":
          setLengths([...lengths, value]);
          setLengthInput("");
          break;
        case "colors":
          setColors([...colors, value]);
          setColorInput("");
          break;
        default:
          break;
      }
    }
  };

  const removeItem = (list, index) => {
    let updatedItems;
    switch (list) {
      case "breeds":
        updatedItems = breeds.filter((breed, i) => i !== index);
        setBreeds(updatedItems);
        break;
      case "traits":
        updatedItems = traits.filter((trait, i) => i !== index);
        setTraits(updatedItems);
        break;
      case "lengths":
        updatedItems = lengths.filter((length, i) => i !== index);
        setLengths(updatedItems);
        break;
      case "colors":
        updatedItems = colors.filter((color, i) => i !== index);
        setColors(updatedItems);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.editpopup}>
      <div className={styles.editpopup__header}>
        <h2>{category.animal}</h2>
        <CloseRoundedIcon
          fontSize="large"
          onClick={onClose}
          className={styles.editpopup__close}
        />
      </div>
      <div className={styles.editpopup__main}>
        <div className={styles.editpopup__list}>
          <h4>Veislės</h4>
          {breeds.map((breed, index) => (
            <div className={styles.editpopup__item} key={breed}>
              {breed}
              <div
                className={styles.editpopup__button}
                onClick={() => removeItem("breeds", index)}
              >
                <CloseRoundedIcon />
              </div>
            </div>
          ))}
          <div className={styles.editpopup__input}>
            <input
              type="text"
              value={breedInput}
              onChange={(e) => setBreedInput(e.target.value)}
            />
            <div
              className={styles.editpopup__button}
              onClick={() => addItem("breeds", breedInput)}
            >
              <Add />
            </div>
          </div>
        </div>
        <div className={styles.editpopup__list}>
          <h4>Savybės</h4>
          {traits.map((trait, index) => (
            <div className={styles.editpopup__item} key={trait}>
              {trait}
              <div
                className={styles.editpopup__button}
                onClick={() => removeItem("traits", index)}
              >
                <CloseRoundedIcon />
              </div>
            </div>
          ))}
          <div className={styles.editpopup__input}>
            <input
              type="text"
              value={traitInput}
              onChange={(e) => setTraitInput(e.target.value)}
            />
            <div
              className={styles.editpopup__button}
              onClick={() => addItem("traits", traitInput)}
            >
              <Add />
            </div>
          </div>
        </div>
        <div className={styles.editpopup__list}>
          <h4>Kailio ilgis</h4>
          {lengths.map((length, index) => (
            <div className={styles.editpopup__item} key={length}>
              {length}
              <div
                className={styles.editpopup__button}
                onClick={() => removeItem("lengths", index)}
              >
                <CloseRoundedIcon />
              </div>
            </div>
          ))}
          <div className={styles.editpopup__input}>
            <input
              type="text"
              value={lengthInput}
              onChange={(e) => setLengthInput(e.target.value)}
            />
            <div
              className={styles.editpopup__button}
              onClick={() => addItem("lengths", lengthInput)}
            >
              <Add />
            </div>
          </div>
        </div>
        <div className={styles.editpopup__list}>
          <h4>Kailio spalva</h4>
          {colors.map((color, index) => (
            <div className={styles.editpopup__item} key={color}>
              {color}
              <div
                className={styles.editpopup__button}
                onClick={() => removeItem("colors", index)}
              >
                <CloseRoundedIcon />
              </div>
            </div>
          ))}
          <div className={styles.editpopup__input}>
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
            />
            <div
              className={styles.editpopup__button}
              onClick={() => addItem("colors", colorInput)}
            >
              <Add />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.editpopup__actions}>
        <Button onClick={handleSubmit}>Išsaugoti</Button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default CategoryEdit;
