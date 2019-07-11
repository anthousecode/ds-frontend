import {AbstractControl} from '@angular/forms';
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
