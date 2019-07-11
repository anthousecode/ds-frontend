import {Directive, ElementRef, Input} from '@angular/core';
import * as Inputmask from 'inputmask';

export const regexMapVal = {
  name: '^([А-Яа-яёЁ]([ \'-]?[А-Яа-яёЁ])?)+$',
  patronymic: '^([а-яё]([ -]?[а-яё])?)+$',
  birthDocumentSeries: '^[IVXLC1УХЛС]{1,4}-[А-Я]{2}$',
  birthDocumentNumber: '\d{6}',
  armyDocumentSeries: '^[А-Я]{2}$',
  armyDocumentNumber: '\\d{6,7}',
  passportSeries: '^\\d{4}$',
  passportNumber: '^\\d{6}$',
  temporaryIdSeries: '^[-]+$',
  temporaryIdNumber: '^(?=.{1,14}$).*',
  internationalPassportSeries: '^\\d{2}$',
  internationalPassportNumber: '\\d{7}',
  anotherDocumentSeries: '^.{1,20}$',
  anotherDocumentNumber: '^.{1,20}$',
  date: '^\\s*(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((?:19|20)\\d{2})\\s*$',
  dateRange: '^(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((19|20)\\d{2})' +
    '[-](3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((19|20)\\d{2})*$',
  inn: '^[0-9]{10,12}+$'
};

export const regexMapForInput = {
  name: '^([А-Яа-яёЁ]?([ \'-]?[А-Яа-яёЁ])?)+$',
  patronymic: '^([а-яё]([ -]?[а-яё])?)+$',
  birthDocumentSeries: '^[IVXLC1УХЛС]{1,4}-[А-Я]{2}$',
  birthDocumentNumber: '\d{6}',
  armyDocumentSeries: '^[А-Я]{2}$',
  armyDocumentNumber: '\\d{6,7}',
  passportSeries: '^\\d{4}$',
  passportNumber: '^\\d{6}$',
  temporaryIdSeries: '^[-]+$',
  temporaryIdNumber: '^(?=.{1,14}$).*',
  internationalPassportSeries: '^\\d{2}$',
  internationalPassportNumber: '\\d{7}',
  anotherDocumentSeries: '^.{1,20}$',
  anotherDocumentNumber: '^.{1,20}$',
  date: '^\\s*(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((?:19|20)\\d{2})\\s*$',
  dateRange: '^(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((19|20)\\d{2})' +
    '[-](3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((19|20)\\d{2})*$',
  inn: '^\\d+$'
};




@Directive({
  selector: '[appValidateInput]'
})

/**
 * Валидация наших полей по правилу ИАС.
 * Подробнее ознокомится можно {@link https://conf.bars.group/pages/viewpage.action?pageId=52800606 | Ссылка на систему }
 */
export class ValidationDirective {


  constructor(private el: ElementRef) {
  }

  /**
   * Определение по типу валидаций и приминяет его
   * @param type - входные параметры из regexMap - KEY
   */
  @Input('appValidateInput')
  public set defineInputType(type: string) {
    if (type) {
      Inputmask({regex: regexMapForInput[type], placeholder: ''})
        .mask(this.el.nativeElement);
    }
  }

}
