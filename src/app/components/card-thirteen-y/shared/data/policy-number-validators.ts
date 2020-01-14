import {Validators} from '@angular/forms';

export const DEFAULT_POLICY_NUMBER_VALIDATORS = [
  Validators.required,
  Validators.minLength(9),
  Validators.maxLength(9),
  Validators.pattern('^[0-9a-zA-Zа-яА-Я]+$')
];

export const OLD_POLICY_NUMBER_VALIDATORS = [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(10),
  Validators.pattern('^[0-9a-zA-Zа-яА-Я]+$')
];

export const NEW_POLICY_NUMBER_VALIDATORS = [
  Validators.required,
  Validators.minLength(16),
  Validators.maxLength(16),
  Validators.pattern('^[0-9a-zA-Zа-яА-Я]+$')
];
