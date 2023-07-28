import React, { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import Button from "../../components/atoms/Button";
import Logo from "../../components/atoms/Images/Logo";

const Login = () => {
  const [userInfo, setUserInfo] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  useEffect(() => {
    document.title = "Petix | Prisijungimas";
    document.body.style.background =
      "linear-gradient(to right, #009b84, #1ce5af)";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(userInfo, password);
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__logo}>
        <Logo isNeon={true} />
        <p>Augintinių globos paieška.</p>
      </div>
      <div className={styles.login__container}>
        <div className={styles.login__menu}>
          <Link to="/login" className={styles.active}>
            Prisijungimas
          </Link>
          <div className={styles.divider}> </div>
          <Link to="/signup">Registracija</Link>
        </div>
        <form className={styles.login__form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="El. paštas arba vartotojo vardas"
            onChange={(e) => setUserInfo(e.target.value)}
            value={userInfo}
            name="userInfo"
          />
          <input
            placeholder="Slaptažodis"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name="password"
          />
          <div className={styles.login__button}>
            <Button disabled={isLoading}>Prisijungti</Button>
            {error && <div className={styles.login__error}>{error}</div>}
          </div>
          <p className={styles.login__text}>
            Dar neturite paskyros? <Link to="/signup">Registruotis.</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
