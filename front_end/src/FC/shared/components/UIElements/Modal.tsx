import React, { CSSProperties } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import { BackDrop } from "./BackDrop";
import "./Modal.css";

import "./Modal.css";

type Props = {
  show: boolean;
  onCancel: Function;
  className?: string;
  style?: CSSProperties;
  headerClass?: string;
  header?: string;
  onSubmit?: Function;
  contentClass?: string;
  footerClass?: string;
  footer?: JSX.Element;
  children: JSX.Element;
};

function ModalOverlay(props: Props) {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit
            ? () => (props.onSubmit as Function)()
            : (event) => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(
    content,
    document.getElementById("modal-hook") as HTMLElement
  );
}

function Modal(props: Props) {
  return (
    <React.Fragment>
      {props.show && <BackDrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
}

export default Modal;
