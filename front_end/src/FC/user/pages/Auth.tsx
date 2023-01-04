import React, { useContext, useState } from "react";
import { AuthContext } from "../../../hooks/auth-context";
import { useForm } from "../../../hooks/form-hook";
import { reducerInputStateInitVal } from "../../../hooks/useReducer";
import { EValidatorType } from "../../../typing/enums";
import { reducerInputState } from "../../../typing/types";
import {
  DEFAULT_HEADERS,
  ERROR_DESCRIPTION_LENGTH,
  ERROR_IMAGE,
  ERROR_TEXT_REQUIRED,
  ERROR_VALID_EMAIL,
  PATH_LOGIN,
  PATH_SIGNUP,
} from "../../../util/Constants";
import { Button } from "../../shared/components/FormElements/Button";
import { Input } from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import { IUser } from "../../../typing/interfaces";

import "./Auth.css";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../../hooks/http-hook";
import { ImageUpload } from "../../shared/components/FormElements/ImageUpload";

export function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: reducerInputStateInitVal,
          image: reducerInputStateInitVal,
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    let res;
    let user: IUser = {
      email: formState.inputs.email!.value as string,
      password: formState.inputs.password!.value as string,
    };

    if (isLoginMode) {
      try {
        res = await sendRequest(
          PATH_LOGIN,
          "POST",
          JSON.stringify(user),
          DEFAULT_HEADERS
        );
      } catch (err) {}
    } else {
      user = {
        ...user,
        name: formState.inputs.name!.value as string,
        image: formState.inputs.image!.value as string,
      };
      try {
        const formData = new FormData();
        formData.append("email", user.email);
        formData.append("name", user.name!);
        formData.append("password", user.password!);
        formData.append("image", user.image!);

        res = await sendRequest(PATH_SIGNUP, "POST", formData);
      } catch (err) {}
    }

    if (res) {
      ctx.login(res);
    }
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        <>{isLoading && <LoadingSpinner asOverlay />}</>
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
          {!isLoginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText={ERROR_IMAGE}
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
    </React.Fragment>
  );
}
