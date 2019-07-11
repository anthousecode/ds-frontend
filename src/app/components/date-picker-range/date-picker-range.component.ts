import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {IMyDrpOptions, IMyInputFieldChanged} from 'mydaterangepicker';

moment.locale('ru');

@Component({
  selector: 'app-date-picker-range',
  templateUrl: './date-picker-range.component.html',
  styleUrls: ['./date-picker-range.component.sass']
})
export class DatePickerRangeComponent implements OnInit {

  constructor() {
    console.log({year: moment().year(), month: moment().month(), day: moment().day()});
  }

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onChanged = new EventEmitter<string[]>();
  @Input() public control: any = null;

  isValid = true;
  isFirst = 0;
  myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd.mm.yyyy',
    indicateInvalidDateRange: true,
    inline: false,
    showSelectDateText: false,
    maxYear: moment().year(),
    minYear: 1900,
    disableSince: {year: moment().year(), month: moment().month(), day: moment().day()},
    dayLabels: {su: 'Вос.', mo: 'Пон.', tu: 'Вт.', we: 'Ср.', th: 'Чт.', fr: 'Пят.', sa: 'Суб.'},
    width: '100%',
    monthLabels: {
      1: 'Янв.',
      2: 'Фев.',
      3: 'Март',
      4: 'Апр.',
      5: 'Май',
      6: 'Июнь',
      7: 'Июль',
      8: 'Авг.',
      9: 'Сент.',
      10: 'Окт.',
      11: 'Нояб.',
      12: 'Дек.'
    }
  };

  static checkValid(control: string): boolean {
    const val = moment(control, 'DD.MM.YYYY');
    if (control) {
      if (val.isAfter(moment(), 'day')) {
        return false;
      }
      return !val.isBefore(moment('01.01.1900', 'DD.MM.YYYY'), 'years');
    }
  }

  onInputFieldChanged(event: IMyInputFieldChanged) {
    this.isValid = event.valid;
    const first = event.value.split(' - ');
    console.log(first);
    if (event.valid) {
      if (DatePickerRangeComponent.checkValid(first[0]) && DatePickerRangeComponent.checkValid(first[1])) {
        this.onChanged.emit(first);
      } else {
        this.isValid = false;
      }
    }
  }

  ngOnInit() {
  }
}
