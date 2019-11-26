import {AbstractControl, ValidatorFn} from '@angular/forms';
import * as moment from 'moment';

/**
 *
 * @param control - получаем данные реактивной формы.
 * @return возвращает нам обьект если валидация не правильная. Если правильная то null.
 */
export function DateValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const val = moment(control.value);
  if (control.value) {
    if (!val.isValid()) {
      return {invalidDate: true};
    }
    if (val.isAfter(moment(), 'day')) {
      return {invalidDate: true};
    }
    if (val.isBefore(moment('01/01/1900', 'MM/DD/YYYY'), 'years')) {
      return {invalidDate: true};
    }
    return null;
  }
}

export function DateExaminationValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const val = moment(control.value).valueOf();
  const subtractYear = moment().subtract(1, 'year').valueOf();
  return !(val >= subtractYear && val <= moment.now()) ? {invalidDate: true} : null;
}

export function BirthdayValidator(validatorsData: any): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const val = moment(control.value).valueOf();
    const birthDay = validatorsData.birthday.valueOf();
    const addYear: any = moment(validatorsData.examDate.value).add(1, 'year').valueOf();   // TODO: check type any

    if (val >= birthDay &&
        val <= addYear &&
        val < moment.now()) {
      console.log('date VALID');
      return null;
    } else {
      if (val > addYear) {
        return addYear.formar('MMMM Do YYYY, HH:mm:ss a').subtract(1, 'day');
      }
      if (val < birthDay) {
        return birthDay.formar('MMMM Do YYYY, HH:mm:ss a').add(1, 'day');
      }
      console.log('date INVALID');
      return {invalidDate: true};
    }
  };
}
