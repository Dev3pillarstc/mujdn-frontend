import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { isValidValue } from '@/utils/utils';

const defaultLengths = {
  MIN_LENGTH: 3,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 50,
  SHORT_NAME_MAX: 30,
  ARABIC_NAME_MAX: 250,
  REGION_NAME_MAX: 100,
  ENGLISH_NAME_MAX: 250,
  NOTES: 2000,
  EMAIL_MAX: 200,
  PHONE_NUMBER_MAX: 15,
  ADDRESS_MAX: 1000,
  QID_MIN: 11,
  QID_MAX: 11,
  SWIFT_CODE_MIN: 8,
  SWIFT_CODE_MAX: 11,
  NUMBERS_MAXLENGTH: 4,
  DECIMAL_PLACES: 2,
  EXPLANATIONS: 1333,
  _500: 500,
  INT_MAX: 2_147_483_647,
};

export function pattern(patternName: customValidationTypes): ValidatorFn {
  if (!patternName || !validationPatterns.hasOwnProperty(patternName)) {
    return Validators.nullValidator;
  }

  return (control: AbstractControl): ValidationErrors | null => {
    if (!isValidValue(control.value)) {
      return null;
    }
    const response: object = {};
    // @ts-ignore
    response[patternName] = true;
    return !validationPatterns[patternName].test(control.value) ? response : null;
  };
}

// Custom validator for number max length (works with number inputs)
export function numberMaxLength(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isValidValue(control.value)) {
      return null;
    }

    const value = control.value;
    const stringValue = value.toString();

    if (stringValue.length > maxLength) {
      return {
        maxlength: {
          requiredLength: maxLength,
          actualLength: stringValue.length,
        },
      };
    }

    return null;
  };
}

// Custom validator for number min length (works with number inputs)
export function numberMinLength(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isValidValue(control.value)) {
      return null;
    }

    const value = control.value;
    const stringValue = value.toString();

    if (stringValue.length < minLength) {
      return {
        minlength: {
          requiredLength: minLength,
          actualLength: stringValue.length,
        },
      };
    }

    return null;
  };
}

// Custom validator for positive numbers only
export function positiveNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isValidValue(control.value)) {
      return null;
    }

    const value = Number(control.value);

    if (isNaN(value) || value < 0) {
      return { positiveNumber: true };
    }

    return null;
  };
}

// Custom validator for number range
export function numberRange(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isValidValue(control.value)) {
      return null;
    }

    const value = Number(control.value);

    if (isNaN(value)) {
      return { invalidNumber: true };
    }

    if (value < min || value > max) {
      return {
        numberRange: {
          min,
          max,
          actual: value,
        },
      };
    }

    return null;
  };
}

function startBeforeEnd(startField: string, endField: string): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const start = form.get(startField)?.value;
    const end = form.get(endField)?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return startDate > endDate ? { startAfterEnd: true } : null;
  };
}

export function timeFromBeforeTimeTo(fromKey: string, toKey: string): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const fromControl = form.get(fromKey);
    const toControl = form.get(toKey);

    if (!fromControl?.value || !toControl?.value) return null;

    const from = new Date(fromControl.value);
    const to = new Date(toControl.value);

    from.setSeconds(0, 0);
    to.setSeconds(0, 0);

    return from >= to ? { timeFromAfterTimeTo: true } : null;
  };
}

export type customValidationTypes =
  | 'ENG_NUM'
  | 'AR_NUM'
  | 'ENG_ONLY'
  | 'AR_ONLY'
  | 'ENG_NUM_ONLY'
  | 'AR_NUM_ONLY'
  | 'ENG_NUM_ONE_ENG'
  | 'AR_NUM_ONE_AR'
  | 'ENG_AR_ONLY'
  | 'ENG_AR_NUM_ONLY'
  | 'ENG_NO_SPACES_ONLY'
  | 'PASSPORT'
  | 'EMAIL'
  | 'NUM_HYPHEN_COMMA'
  | 'PHONE_NUMBER'
  | 'WEBSITE'
  | 'URL'
  | 'HAS_LETTERS'
  | 'START_BEFORE_END'
  | 'TIME_FROM_BEFORE_TIME_TO'
  | 'NATIONAL_ID';

export const validationPatterns: any = {
  ENG_NUM: new RegExp(/^[a-zA-Z0-9\- ]+$/),
  AR_NUM: new RegExp(/^[\u0621-\u064A0-9\u0660-\u0669\- ]+$/),
  ENG_ONLY: new RegExp(/^[a-zA-Z ]+$/),
  AR_ONLY: new RegExp(/^[\u0621-\u064A ]+$/),
  ENG_NUM_ONLY: new RegExp(/^[a-zA-Z0-9]+$/),
  AR_NUM_ONLY: new RegExp(/^[\u0621-\u064A0-9\u0660-\u0669]+$/),
  ENG_NUM_ONE_ENG: new RegExp(/^(?=.*[a-zA-Z])([a-zA-Z0-9\- ]+)$/),
  AR_NUM_ONE_AR: new RegExp(/^(?=.*[\u0621-\u064A])([\u0621-\u064A0-9\u0660-\u0669\- ]+)$/),
  ENG_AR_ONLY: new RegExp(/^[a-zA-Z\u0621-\u064A ]+$/),
  ENG_AR_NUM_ONLY: new RegExp(/^[a-zA-Z\u0621-\u064A0-9\u0660-\u0669 ]+$/),
  ENG_NO_SPACES_ONLY: new RegExp(/^[a-zA-Z]+$/),
  PASSPORT: new RegExp('^[A-Z][0-9]{8,}$'),
  EMAIL: new RegExp(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/
  ),
  NUM_HYPHEN_COMMA: new RegExp('^(?=.*?[1-9])[0-9-,._]+$'),
  PHONE_NUMBER: new RegExp(/^[+]?[0-9]+$/),
  WEBSITE: new RegExp(
    /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_=]+=[a-zA-Z0-9-%]+&?)?$/
  ),
  URL: new RegExp(
    'https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}'
  ),
  HAS_LETTERS: new RegExp(
    /^[\u0621-\u064A0-9\u0660-\u0669\u0621-\u064Aa-zA-Z0-9]*[\u0621-\u064Aa-zA-Z ]/
  ),
  NATIONAL_ID: new RegExp(/^(1|2)\d{9}$/),
};

export function strongPassword(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= defaultLengths.PASSWORD_MIN;
    const isShortEnough = value.length <= defaultLengths.PASSWORD_MAX;

    const valid =
      hasUpperCase && hasLowerCase && hasDigit && hasSpecial && isLongEnough && isShortEnough;

    return valid
      ? null
      : {
          strongPassword: {
            hasUpperCase,
            hasLowerCase,
            hasDigit,
            hasSpecial,
            isLongEnough,
            isShortEnough,
          },
        };
  };
}

export const CustomValidators = {
  defaultLengths,
  pattern,
  startBeforeEnd,
  strongPassword,
  numberMaxLength,
  numberMinLength,
  positiveNumber,
  numberRange,
  timeFromBeforeTimeTo,
};
