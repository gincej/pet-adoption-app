import React, { useEffect, useState } from "react";
import { useSignUp } from "../../hooks/useSignUp";
import Button from "../../components/atoms/Button";
import Logo from "../../components/atoms/Images/Logo";
import { Link } from "react-router-dom";
import styles from "./SignUp.module.scss";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const { signup, error, isLoading } = useSignUp();

  useEffect(() => {
    document.title = "Petix | Registracija";
    document.body.style.background =
      "linear-gradient(to right, #009b84, #1ce5af)";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(email, password, name, username);
  };

  return (
    <div className={styles.signup}>
      <div className={styles.signup__logo}>
        <Logo isNeon={true} />
        <p>Augintinių globos paieška.</p>
      </div>
      <div className={styles.signup__container}>
        <div className={styles.signup__menu}>
          <Link to="/login">Prisijungimas</Link>
          <div className={styles.divider}> </div>
          <Link to="/signup" className={styles.active}>
            Registracija
          </Link>
        </div>
        <form className={styles.signup__form} onSubmit={handleSubmit}>
          <input
            placeholder="Jūsų vardas"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            name="name"
          />
          <input
            placeholder="Vartotojo vardas"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            name="username"
          />
          <input
            placeholder="El. paštas"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name="email"
          />
          <input
            placeholder="Slaptažodis"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name="password"
          />

          <input
            placeholder="Pakartokite slaptažodį"
            type="password"
            onChange={(e) => setRepeatedPassword(e.target.value)}
            value={repeatedPassword}
            name="password"
          />
          {repeatedPassword && repeatedPassword !== password && (
            <label>Slaptažodžiai nesutampa.</label>
          )}
          <div className={styles.signup__button}>
            <Button disabled={isLoading || password !== repeatedPassword}>
              Registruotis
            </Button>
            {error && <div className={styles.signup__error}>{error}</div>}
          </div>
          <p className={styles.signup__text}>
            Jau turite paskyrą? <Link to="/login">Prisijungti.</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
