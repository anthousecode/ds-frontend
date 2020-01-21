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
    return val >= subtractYear && val <= moment.now() ? null : {invalidDate: true};
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

// only for (blur)
export function childsCurrentLocationValidator(locationDateControl: AbstractControl, minDate, maxDate) {
    if (!locationDateControl.value || !minDate || !maxDate) {
        return;
    }
    const minDateSeconds = moment(minDate).valueOf();
    const maxDateSecondsPlus1Year = moment(maxDate).add(1, 'year').valueOf();
    let locationDateSeconds: number;

    if (typeof locationDateControl.value === 'string') {
        locationDateSeconds = moment(locationDateControl.value).valueOf();
    } else {
        locationDateSeconds = locationDateControl.value.valueOf();
    }

    if (locationDateSeconds < minDateSeconds) {
        locationDateControl.setValue(moment(minDateSeconds).format());
    } else if (locationDateSeconds > moment.now()) {
        locationDateControl.setValue(moment(moment.now()).format());
    } else if (locationDateSeconds > maxDateSecondsPlus1Year) {
        locationDateControl.setValue(moment(maxDateSecondsPlus1Year).format());
    }
}
