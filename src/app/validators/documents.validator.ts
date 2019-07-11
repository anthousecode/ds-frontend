// @ts-ignore
import { PatientDocumentTypeRegex } from '../interface/dictionary';

export const patientDocTypeRegex: PatientDocumentTypeRegex[] = [
  {
    id: 3,
    series: '^[IVXLC1УХЛС]{1,4}-[А-Я]{2}$',
    number: '\\d{6}',
    nameSeries: 'birthDocumentSeries',
    nameNumber: 'birthDocumentNumber'
  },
  {
    id: 13,
    series: '^[-]+$',
    number: '^(?=.{1,14}$).*',
    nameNumber: 'temporaryIdSeries',
    nameSeries: 'temporaryIdNumber'
  },
  {
    id: 7,
    series: '^[А-Я]{2}$',
    number: '\\d{6,7}',
    nameNumber: 'armyDocumentSeries',
    nameSeries: 'armyDocumentNumber'
  },
  {
    id: 14,
    series: '^\\d{4}$',
    number: '\\d{6}',
    nameNumber: 'passportSeries',
    nameSeries: 'passportNumber'
  },
  {
    id: 15,
    series: '^\\d{2}$',
    number: '\\d{7}',
    nameNumber: 'internationalPassportSeries',
    nameSeries: 'internationalPassportNumber'

  },
  {
    id: 19,
    series: '[^-\\s].{1,20}$',
    number: '[^-\\s].{1,20}$',
    nameNumber: 'anotherDocumentSeries',
    nameSeries: 'anotherDocumentSeries'
  },
  {
    id: 9,
    series: '[^-\\s].{1,20}$',
    number: '[^-\\s].{1,20}$',
    nameNumber: 'anotherDocumentSeries',
    nameSeries: 'anotherDocumentSeries'
  },
  {
    id: 999,
    series: '[^-\\s].{1,50}$',
    number: '[^-\\s].{1,50}$',
    nameNumber: 'anotherDocumentSeries',
    nameSeries: 'anotherDocumentSeries'
  }
];
