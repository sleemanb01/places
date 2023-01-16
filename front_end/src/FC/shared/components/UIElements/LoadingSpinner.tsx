import React from "react";

import "./LoadingSpinner.css";

export function LoadingSpinner({ asOverlay }: { asOverlay: boolean }) {
  return (
    <div className={`${asOverlay && "loading-spinner__overlay"}`}>
      <div className="lds-dual-ring"></div>
    </div>
  );
}

export default LoadingSpinner;
