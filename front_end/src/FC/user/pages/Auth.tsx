import { useContext, useState } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { reducerInputStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../typing/enums";
import { reducerInputState } from "../../../typing/types";
import {
  ERROR_DESCRIPTION_LENGTH,
  ERROR_TEXT_REQUIRED,
  ERROR_VALID_EMAIL,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { IUser } from "../../../typing/interfaces";

import "./Auth.css";
import { login, signUp } from "../../../util/axios";

export function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const ctx = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: reducerInputStateInitVal,
      password: reducerInputStateInitVal,
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      formState.inputs.email = formState.inputs.email as reducerInputState;
      formState.inputs.password = formState.inputs
        .password as reducerInputState;
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: reducerInputStateInitVal,
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    let res = false;
    let user: IUser = {
      email: formState.inputs.email!.value,
      password: formState.inputs.password!.value,
    };

    if (isLoginMode) {
      res = await login(user);
    } else {
      user = { ...user, name: formState.inputs.name!.value };

      res = await signUp(user);
    }

    if (res) {
      ctx.login(user);
    }
  };

  return (
    <Card className="authentication">
      <h2>Login Required</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[EValidatorType.REQUIRE]}
            errorText={ERROR_TEXT_REQUIRED}
            onInput={inputHandler}
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[EValidatorType.EMAIL]}
          errorText={ERROR_VALID_EMAIL}
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[EValidatorType.MINLENGTH]}
          errorText={ERROR_DESCRIPTION_LENGTH}
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </form>
      <Button inverse onClick={switchModeHandler}>
        {`SWITCH TO ${isLoginMode ? "SIGNUP" : "LOGIN"}`}
      </Button>
    </Card>
  );
}
