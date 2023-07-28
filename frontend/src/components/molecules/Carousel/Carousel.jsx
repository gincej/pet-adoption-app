import React, { useState } from "react";
import styles from "./Carousel.module.scss";
import ArrowRight from "../../atoms/Icons/ArrowRight";
import ArrowLeft from "../../atoms/Icons/ArrowLeft";

const Carousel = ({ pictures }) => {
  const [currentPicture, setCurrentPicture] = useState(0);

  const nextPicture = () => {
    setCurrentPicture((currentPicture + 1) % pictures.length);
  };

  const prevPicture = () => {
    setCurrentPicture((currentPicture + pictures.length - 1) % pictures.length);
  };

  return (
    <div className={styles.carousel}>
      <div onClick={prevPicture}>
        <ArrowLeft />
      </div>
      <div className={styles.carousel__picture}>
        <img src={`/Pets/${pictures[currentPicture]}`} alt="Pet pictures" />
      </div>
      <div onClick={nextPicture}>
        <ArrowRight />
      </div>
    </div>
  );
};

export default Carousel;
