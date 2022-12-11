import ReactDOM from "react-dom";

import "./BackDrop.css";

export function BackDrop({ onClick }: { onClick: Function }) {
  const content = <div className="backdrop" onClick={() => onClick()}></div>;

  return ReactDOM.createPortal(
    content,
    document.getElementById("backDrop-hook") as HTMLElement
  );
}
