import React, { useContext } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerFormStateInitVal } from "../../../hooks/useReducer";
import { useNavigate } from "react-router-dom";
import { EValidatorType } from "../../../typing/enums";
import {
  ERROR_DESCRIPTION_LENGTH,
  ERROR_TEXT_REQUIRED,
  ENDPOINT_PLACES,
  ERROR_IMAGE,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./PlaceForm.css";
import { ImageUpload } from "../../shared/components/FormElements/ImageUpload";

export function NewPlace() {
  const [formState, inputHandler] = useForm(
    reducerFormStateInitVal.inputs,
    reducerFormStateInitVal.isValid
  );
  const nav = useNavigate();

  const user = useContext(AuthContext).user;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formState) {
      return;
    }

    const formData = new FormData();
    formData.append("title", formState.inputs.title!.value);
    formData.append("description", formState.inputs.description!.value);
    formData.append("address", formState.inputs.address!.value);
    formData.append("creatorId", user.userId);
    formData.append("image", formState.inputs.image!.value);

    try {
      await sendRequest(ENDPOINT_PLACES, "POST", formData, {
        Authorization: "Barer " + user.token,
      });
      console.log("submitting...");

      nav("/");
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <form className="place-form" onSubmit={submitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[EValidatorType.REQUIRE]}
          errorText={ERROR_TEXT_REQUIRED}
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[EValidatorType.MINLENGTH]}
          errorText={ERROR_DESCRIPTION_LENGTH}
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[EValidatorType.REQUIRE]}
          errorText={ERROR_TEXT_REQUIRED}
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText={ERROR_IMAGE}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
}
