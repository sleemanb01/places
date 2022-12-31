import React, { useContext } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerFormStateInitVal } from "../../../hooks/useReducer";
import { useNavigate } from "react-router-dom";
import { EValidatorType } from "../../../typing/enums";
import {
  DEFAULT_HEADERS,
  ERROR_DESCRIPTION_LENGTH,
  ERROR_TEXT_REQUIRED,
  PATH_PLACES,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./PlaceForm.css";

export function NewPlace() {
  const [formState, inputHandler] = useForm(
    reducerFormStateInitVal.inputs,
    reducerFormStateInitVal.isValid
  );
  const nav = useNavigate();

  const userId = useContext(AuthContext).user!._id;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formState) {
      return;
    }

    const newPlace = {
      title: formState.inputs.title!.value,
      description: formState.inputs.description!.value,
      address: formState.inputs.address!.value,
      creatorId: userId,
    };

    try {
      await sendRequest(
        PATH_PLACES,
        "POST",
        JSON.stringify(newPlace),
        DEFAULT_HEADERS
      );

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
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
}
