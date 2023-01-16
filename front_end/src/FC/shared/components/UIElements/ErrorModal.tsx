import React from "react";
import { Button } from "../FormElements/Button";
import Modal from "./Modal";

export function ErrorModal({
  onClear,
  error,
}: {
  onClear: Function;
  error: string | null;
}) {
  return (
    <Modal
      onCancel={onClear}
      header="An Error Occurred!"
      show={!!error}
      footer={<Button onClick={onClear}>Okay</Button>}
    >
      <p>{error}</p>
    </Modal>
  );
}
