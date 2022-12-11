import { useForm } from "../../../hooks/form-hook";
import { reducerFormStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../typing/enums";
import {
  ERROR_DESCRIPTION_LENGTH,
  ERROR_TEXT_REQUIRED,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";

import "./PlaceForm.css";

export function NewPlace() {
  const [formState, inputHandler] = useForm(
    reducerFormStateInitVal.inputs,
    reducerFormStateInitVal.isValid
  );

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formState.inputs); // later to the backend
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
  );
}
