import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ValidationService} from '../../service/validation.service';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.sass'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DatePickerComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() placeholder: string;
  @Input() changedMinimalDate: Date;
  minDate = new Date(1900, 0, 1);
  maxDate = new Date();

  constructor() {
  }

  ngOnInit() {
    if (this.changedMinimalDate) {
      this.minDate = this.changedMinimalDate;
    }
  }

  isValid(name: string) {
    return ValidationService.checkValidation(name, this.form);
  }
}
