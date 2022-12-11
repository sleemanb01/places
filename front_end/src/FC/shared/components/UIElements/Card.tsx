import React from "react";

import "./Card.css";

const Card = ({
  className,
  style,
  children,
}: {
  className?: String;
  style?: React.CSSProperties;
  children: JSX.Element | JSX.Element[];
}) => {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
