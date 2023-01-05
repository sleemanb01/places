import { EValidatorType } from "../typing/enums";
import { MINLENGTH, MAXLENGTH, MIN, MAX } from "./Constants";

export const VALIDATE = (
  value: string | number | File,
  validators: EValidatorType[]
) => {
  let isValid = true;
  for (const validator of validators) {
    if (validator === EValidatorType.REQUIRE) {
      value = value as string;
      isValid = isValid && value.trim().length > 0;
    }
    if (validator === EValidatorType.MINLENGTH) {
      value = value as string;
      isValid = isValid && value.trim().length >= MINLENGTH;
    }
    if (validator === EValidatorType.MAXLENGTH) {
      value = value as string;
      isValid = isValid && value.trim().length <= MAXLENGTH;
    }
    if (validator === EValidatorType.MIN) {
      isValid = isValid && +value >= MIN;
    }
    if (validator === EValidatorType.MAX) {
      isValid = isValid && +value <= MAX;
    }
    if (validator === EValidatorType.EMAIL) {
      value = value as string;
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validator === EValidatorType.FILE) {
      value = value as File;
      isValid = isValid && !!value.name.match(/\.(jpg|jpeg|png|gif)$/);
    }
  }
  return isValid;
};
