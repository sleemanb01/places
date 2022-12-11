import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

type btnType = "submit" | "reset" | "button";

export function Button({
  href,
  size,
  inverse,
  danger,
  children,
  to,
  type,
  onClick,
  disabled,
}: {
  href?: string;
  size?: number;
  inverse?: boolean;
  danger?: boolean;
  children: JSX.Element | string;
  to?: string;
  type?: btnType;
  onClick?: Function;
  disabled?: boolean;
}) {
  if (href) {
    return (
      <a
        className={`button button--${size || "default"} ${
          inverse && "button--inverse"
        } ${danger && "button--danger"}`}
        href={href}
      >
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <Link
        to={to}
        className={`button button--${size || "default"} ${
          inverse && "button--inverse"
        } ${danger && "button--danger"}`}
      >
        {children}
      </Link>
    );
  }
  onClick = onClick as Function;
  return (
    <button
      className={`button button--${size || "default"} ${
        inverse && "button--inverse"
      } ${danger && "button--danger"}`}
      type={type}
      onClick={() => onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
