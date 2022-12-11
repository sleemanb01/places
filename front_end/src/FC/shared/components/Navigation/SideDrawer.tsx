import ReactDom from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./SideDrawer.css";

export function SideDrawer({
  children,
  show,
  onClick,
}: {
  children: JSX.Element;
  show: boolean;
  onClick: Function;
}) {
  const content = (
    <CSSTransition
      in={show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={() => onClick()}>
        {children}
      </aside>
    </CSSTransition>
  );

  return ReactDom.createPortal(
    content,
    document.getElementById("drawer-hook") as HTMLElement
  );
}
