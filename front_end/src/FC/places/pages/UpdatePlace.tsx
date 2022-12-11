import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "../../../hooks/form-hook";
import { reducerFormStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../typing/enums";
import { reducerInputState } from "../../../typing/types";
import {
  ERROR_DESCRIPTION_LENGTH,
  ERROR_TEXT_REQUIRED,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";

import "./PlaceForm.css";

const P1 = {
  id: 1,
  creatorId: 1,
  title: "Empire state building",
  description: "one of the most popular sky scrapers on the world",
  address: "20 W 34th st, New York, NY 10001",
  coordinate: {
    lat: 40.7484405,
    lng: -73.9878584,
  },
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
};

const P2 = {
  id: 2,
  creatorId: 1,
  title: "Azrieli Center",
  description: "one of the most popular building in israel",
  address: "Derech Menachem Begin, Tel Aviv-Yafo",
  coordinate: {
    lat: 32.0740769,
    lng: 34.7900141,
  },
  imageUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
};

const DUMMY_PLACES = [P1, P2];

export function UpdatePlace() {
  const placeId = parseInt(useParams().placeId as string);
  const targetPlace = DUMMY_PLACES.find((e) => e.id === placeId);
  const [isLoading, setIsLoading] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    reducerFormStateInitVal.inputs,
    true
  );

  useEffect(() => {
    if (targetPlace) {
      setFormData(
        {
          title: {
            value: targetPlace?.title as string,
            isValid: true,
          },
          description: {
            value: targetPlace?.description as string,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, targetPlace]);

  if (!targetPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find the place!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  return (
    <form className="place-form" onSubmit={submitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[EValidatorType.REQUIRE]}
        errorText={ERROR_TEXT_REQUIRED}
        onInput={inputHandler}
        initValue={(formState.inputs.title as reducerInputState).value}
        initialIsValid={(formState.inputs.title as reducerInputState).isValid}
      />
      <Input
        id="description"
        element="textArea"
        label="Description"
        validators={[EValidatorType.MINLENGTH]}
        errorText={ERROR_DESCRIPTION_LENGTH}
        onInput={inputHandler}
        initValue={(formState.inputs.description as reducerInputState).value}
        initialIsValid={
          (formState.inputs.description as reducerInputState).isValid
        }
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
}
