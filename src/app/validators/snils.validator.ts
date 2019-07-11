import {AbstractControl} from '@angular/forms';

/**
 * Проверка снилс на конечное число
 * @param control - получаем наши данные с реактивной формы
 * @return возвращает нам обьект если валидация не правильная. Если правильная то null.
 */
export function ValiedateSnilsRequired(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value === '00000000000' || control.value === '99999999901') {
    return {snils: false};
  }
  const arr = (control.value + '').split('').map(Number);
  if (arr.length < 11) {
    return {snils: false};
  } else {

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += arr[i] * (9 - i);
    }
    let checkDigit = 0;
    if (sum < 100) {
      checkDigit = sum;
    } else if (sum > 101) {
      checkDigit = sum % 101;
      if (checkDigit === 100) {
        checkDigit = 0;
      }
    }
    if (checkDigit === parseInt(control.value.slice(-2), 10)) {
      return null;
    } else {
      return {snils: false};
    }
  }
}


export function ValiedateSnils(control: AbstractControl): { [key: string]: boolean } | null {
  const arr = (control.value + '').split('').map(Number);
  if (arr.length < 11) {
    return null;
  } else {
    if (control.value === '00000000000' || control.value === '99999999901') {
      return {snils: false};
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += arr[i] * (9 - i);
    }
    let checkDigit = 0;
    if (sum < 100) {
      checkDigit = sum;
    } else if (sum > 101) {
      checkDigit = sum % 101;
      if (checkDigit === 100) {
        checkDigit = 0;
      }
    }
    if (checkDigit === parseInt(control.value.slice(-2), 10)) {
      return null;
    } else {
      return {snils: false};
    }
  }
}
