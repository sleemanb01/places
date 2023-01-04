import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { reducerFormStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../typing/enums";
import { IPlace } from "../../../typing/interfaces";
import { reducerInputState } from "../../../typing/types";
import {
  DEFAULT_HEADERS,
  ERROR_DESCRIPTION_LENGTH,
  ERROR_TEXT_REQUIRED,
  PATH_PLACES,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./PlaceForm.css";

export function UpdatePlace() {
  const userId = useContext(AuthContext).user!._id;
  const placeId = useParams().placeId;
  const nav = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoaddedPlace] = useState<IPlace | null>(null);
  const [formState, inputHandler, setFormData] = useForm(
    reducerFormStateInitVal.inputs,
    true
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const resData = await sendRequest(PATH_PLACES + "/" + placeId);
        const place = resData.place;
        setLoaddedPlace(place);

        setFormData(
          {
            title: {
              value: place.title,
              isValid: true,
            },
            description: {
              value: place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };

    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the place!</h2>
        </Card>
      </div>
    );
  }

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    const place = {
      ...(loadedPlace as IPlace),
      title: formState.inputs.title!.value,
      description: formState.inputs.description!.value,
    };
    try {
      await sendRequest(
        PATH_PLACES + "/" + placeId,
        "PATCH",
        JSON.stringify(place),
        DEFAULT_HEADERS
      );
      nav("/" + userId + "/places");
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
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={submitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[EValidatorType.REQUIRE]}
            errorText={ERROR_TEXT_REQUIRED}
            onInput={inputHandler}
            initValue={
              (formState.inputs.title as reducerInputState).value as string
            }
            initialIsValid={
              (formState.inputs.title as reducerInputState).isValid
            }
          />
          <Input
            id="description"
            element="textArea"
            label="Description"
            validators={[EValidatorType.MINLENGTH]}
            errorText={ERROR_DESCRIPTION_LENGTH}
            onInput={inputHandler}
            initValue={
              (formState.inputs.description as reducerInputState)
                .value as string
            }
            initialIsValid={
              (formState.inputs.description as reducerInputState).isValid
            }
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}
