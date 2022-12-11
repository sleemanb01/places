import { ChangeEvent, useEffect, useReducer } from "react";
import { inputReducer } from "../../../../hooks/useReducer";
import { EReducerActionType, EValidatorType } from "../../../../typing/enums";
import { reducerInputState } from "../../../../typing/types";

import "./Input.css";

export function Input({
  id,
  label,
  element,
  type,
  placeHolder,
  rows,
  validators,
  errorText,
  onInput,
  initValue,
  initialIsValid,
}: {
  id?: string;
  label?: string;
  element?: string;
  type?: string;
  placeHolder?: string;
  rows?: number;
  validators: EValidatorType[];
  errorText: string;
  onInput: Function;
  initValue?: string;
  initialIsValid?: boolean;
}) {
  const reducerInputStateInitVal: reducerInputState = {
    value: initValue || "",
    isTouched: false,
    isValid: initialIsValid || false,
  };
  const [inputState, dispatch] = useReducer(
    inputReducer,
    reducerInputStateInitVal
  );

  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const action = {
      val: event.target.value,
      type: EReducerActionType.CHNAGE,
      validators: validators,
    };
    dispatch(action);
  };

  const touchHandler = () => {
    const action = {
      val: inputState.value,
      type: EReducerActionType.TOUCH,
      validators: validators,
    };

    dispatch(action);
  };

  const currElement =
    element === "input" ? (
      <input
        id={id}
        type={type}
        placeholder={placeHolder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={id}
        rows={rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={id}>{label}</label>
      {currElement}
      {!inputState.isValid && inputState.isTouched && <p>{errorText}</p>}
    </div>
  );
}
