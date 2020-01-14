import {Component, ChangeDetectionStrategy, Inject, Input, ChangeDetectorRef} from '@angular/core';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalInformationComponent {
  @Input() set formValues(data) {
    if (data) {
      this.cardInfo = data;
      this.cdRef.detectChanges();
    }
  }

  constructor(private cardThirteenYService: CardThirteenYService,
              private cdRef: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA) public cardInfo) { }

  getAgeForCheckup() {
    const birthday = moment(this.cardInfo.patient.birthdate);
    const checkupStartDate = moment(this.cardInfo.startDate);
    const days = moment.duration(checkupStartDate.diff(birthday)).days();
    const months = moment.duration(checkupStartDate.diff(birthday)).months();
    const years = moment.duration(checkupStartDate.diff(birthday)).years();
    return this.getCase(days, 'day') + ' ' + this.getCase(months, 'month') + ' ' + this.getCase(years, 'year');
  }

  getCase(date: number, type: string) {
    if ((date % 10 === 0 || date % 10 >= 5) || (date % 100 >= 11 && date % 100 <= 14)) {
      return type === 'day' ? date + ' дней' : (type === 'month' ? date + ' месяцев' : date + ' лет');
    } else if (date % 10 >= 2 && date % 10 <= 4) {
      return type === 'day' ? date + ' дня' : (type === 'month' ? date + ' месяца' : date + ' года');
    } else {
      return type === 'day' ? date + ' день' : (type === 'month' ? date + ' месяц' : date + ' год');
    }
  }

  calcIMT() {
    if (this.cardInfo.physicalDevelopment) {
      const weight = this.cardInfo.physicalDevelopment.weight;
      const height = this.cardInfo.physicalDevelopment.height / 100;
      const imt = weight * height * height;
      return imt.toFixed(2);
    } else {
      return 'не рассчитано';
    }
  }

  toPatientCard() {
   console.log('NAVIGATE TO CARD');
  }
}
