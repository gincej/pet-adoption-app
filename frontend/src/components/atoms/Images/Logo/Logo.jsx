import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Logo.module.scss";

const Logo = ({ isNeon }) => {
  const [isLogoClickable, setIsLogoClickable] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/user/details/")) {
      setIsLogoClickable(false);
    } else {
      setIsLogoClickable(true);
    }
  }, [location.pathname]);

  return (
    <div className={styles.logo}>
      {isLogoClickable ? (
        <img
          src={isNeon ? "/logo-neon.png" : "/logo.png"}
          alt="Logo"
          onClick={() => navigate("/", { state: { value: "all" } })}
        />
      ) : (
        <img src="/logo.png" alt="Logo" />
      )}
    </div>
  );
};

export default Logo;
