import { useReducer, useCallback } from "react";
import { EReducerActionType } from "../typing/enums";
import { reducerFormAction, reducerFormState } from "../typing/types";
import { formReducer } from "./useReducer";

export const useForm = (
  initialInputs: reducerFormState["inputs"],
  initialIsValid: reducerFormState["isValid"]
): [
  reducerFormState,
  (id: string, value: string, isValid: boolean) => void,
  (
    formInputs: reducerFormState["inputs"],
    formIsValid: reducerFormState["isValid"]
  ) => void
] => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialIsValid,
  });

  const inputHandler = useCallback(
    (id: string, value: string, isValid: boolean) => {
      const action: reducerFormAction = {
        type: EReducerActionType.CHNAGE,
        input: {
          value: value,
          isValid: isValid,
        },
        inputId: id,
      };
      dispatch(action);
    },
    []
  );

  const setFormData = useCallback(
    (
      formInputs: reducerFormState["inputs"],
      formIsValid: reducerFormState["isValid"]
    ) => {
      const inputs = { inputs: formInputs, isValid: formIsValid };
      const action: reducerFormAction = {
        type: EReducerActionType.SET,
        input: inputs,
      };
      dispatch(action);
    },
    []
  );

  return [formState, inputHandler, setFormData];
};
