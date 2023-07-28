import React from "react";
import { Link } from "react-router-dom";
import styles from "./Button.module.scss";
import PropTypes from "prop-types";
import classNames from "classnames";

const Button = ({ children, style, to, disabled, ...restProps }) => {
  if (to) {
    return (
      <Link
        {...restProps}
        className={classNames(
          styles.btn,
          {
            [styles["btn--disabled"]]: disabled,
          },
          { [styles["btn--lighter"]]: style === "lighter" },
          { [styles["btn--outlined"]]: style === "outlined" },
          { [styles["btn--red"]]: style === "red" }
        )}
        to={!disabled ? to : ""}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      {...restProps}
      disabled={disabled}
      className={classNames(
        styles.btn,
        {
          [styles["btn--disabled"]]: disabled,
        },
        { [styles["btn--lighter"]]: style === "lighter" },
        { [styles["btn--outlined"]]: style === "outlined" },
        { [styles["btn--red"]]: style === "red" }
      )}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
  style: PropTypes.oneOf(["default", "lighter", "outlined", "red"]),
  disabled: PropTypes.bool,
};

export default Button;
