import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import Button from "../../atoms/Button";
import classNames from "classnames";
import { useAuthContext } from "../../../hooks/useAuthContext";
import styles from "./AdminCategories.module.scss";
import CategoryEdit from "../../molecules/CategoryEdit";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handlePopupClose = () => {
    setShowEdit(false);
  };

  const handleShowEdit = (c) => {
    setShowEdit(true);
    setCategoryToEdit(c);
  };

  return (
    <div className={styles.categories}>
      {showEdit && (
        <CategoryEdit
          onClose={handlePopupClose}
          user={user}
          category={categoryToEdit}
        />
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <p>{error}</p>
      ) : (
        categories.map((category) => (
          <div className={styles.categories__row} key={category._id}>
            <h3 className={styles.categories__animal}>{category.animal}</h3>
            <div className={styles.categories__category} key={category._id}>
              <div className={styles.categories__list}>
                <h4>Veislės</h4>
                {category.breeds.map((breed) => (
                  <p key={breed}>{breed}</p>
                ))}
              </div>

              <div className={styles.categories__list}>
                <h4>Savybės</h4>
                {category.traits.map((trait) => (
                  <p key={trait}>{trait}</p>
                ))}
              </div>

              <div className={styles.categories__list}>
                <h4>Kailio ilgis</h4>
                {category.lengths.map((length) => (
                  <p key={length}>{length}</p>
                ))}
              </div>

              <div className={styles.categories__list}>
                <h4>Kailio spalva</h4>
                {category.colors.map((color) => (
                  <p key={color}>{color}</p>
                ))}
              </div>
            </div>
            <div className={styles.categories__edit}>
              <Button onClick={() => handleShowEdit(category)}>
                Redaguoti
              </Button>
            </div>
          </div>
        ))
      )}
      <div
        className={classNames({
          [styles["categories--overlay"]]: showEdit,
        })}
      ></div>
    </div>
  );
};

export default AdminCategories;
