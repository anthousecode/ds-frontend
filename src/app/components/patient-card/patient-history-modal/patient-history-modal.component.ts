import {Component, Inject, OnInit} from '@angular/core';
import {
  PatientFilterMain,
  PatientHistory,
  PatientHistoryDisplay,
  PatientHistoryDocument,
  PatientHistoryDocumentDisplay
} from '../../../interface/patient';
import {MAT_DIALOG_DATA} from '@angular/material';
import {PatientService} from '../../../service/patient.service';
import {DictionaryService} from '../../../service/dictionary.service';
import {PatientDictionary} from '../../../interface/dictionary';

@Component({
  selector: 'app-patient-history-modal',
  templateUrl: './patient-history-modal.component.html',
  styleUrls: ['./patient-history-modal.component.sass']
})

export class PatientHistoryModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public idPatient: number,
              private apiPatient: PatientService, private apiDictionary: DictionaryService) {
    this.getDictionary();
  }

  patientHistory: PatientHistoryDisplay[];
  patientDictionary: PatientDictionary[];
  displayDocumentHistory: PatientHistoryDocumentDisplay[];
  initHistory: PatientHistory;

  /**
   * Получаем key значение
   * @param obj - обьект
   * @param value - значение
   */
  static extractKeyValue(obj, value) {
    return Object.keys(obj)[Object.values(obj).indexOf(value)];
  }

  /**
   * К нам приходит много данных которые не используется для отоброжение так же при проверке, мы фильтруем эти данные.
   * @param objectHistory - полный json который приходит
   * @return filteredHistory - PatientFilterMain возвращает данные которые фильтрованы.
   */
  static filterHistory(objectHistory: PatientHistory): PatientFilterMain {
    return {
      birthdate: objectHistory.birthdate,
      snils: objectHistory.snils,
      name: objectHistory.name,
      surname: objectHistory.surname,
      idVmpSex: objectHistory.idVmpSex,
      patronymic: objectHistory.patronymic,
      osUser: objectHistory.osUser,
      username: objectHistory.username
    };
  }

  static copyObjects(src) {
    return Object.assign({}, src);
  }

  /**
   *  Конвертируем наш json с ненужными данными, для вывыода данных на фронте
   * @param historyChanged - это история которая изменилась
   * @param historyChangedFiltered - это история которая изменилась которая отфильтровона
   * @param historyPreviousFiltered - это предыдущая история которая отфильтровона
   * @param key - значение из обьекта который изменили
   */
  static patientHistoryDisplayFilter(historyChanged, historyChangedFiltered, historyPreviousFiltered, key): PatientHistoryDisplay {
    const changedKey = PatientHistoryModalComponent.extractKeyValue(historyChangedFiltered, historyChangedFiltered[key]);
    return {
      dateChange: historyChanged.operationDate,
      osUser: historyChanged.osUser,
      fromChange: historyPreviousFiltered[key],
      toChange: historyChangedFiltered[key],
      keyChange: changedKey,
      operation: historyChanged.operation
    };
  }

  static convertDate(date) {
    return new Date(date).toLocaleString().split(',')[0];
  }

  ngOnInit() {
  }

  getPatientHistoryDocument(id: number) {
    this.apiPatient.getHistoryPatientDocument(id).subscribe(
      response => {
        for (const item of response) {
          if (item.issuedDate === null) {
            item.issuedDate = 'не указано';
          } else if (item.issuedBy == null) {
            item.issuedBy = 'не указано';
          } else {
            item.issuedDate = PatientHistoryModalComponent.convertDate(item.issuedDate);
          }
        }
        this.displayHistory(response);
      }
    );
  }

  /**
   * С помощью reduce мы делаем итерацию и ищем изменения.
   * @param history - история пациента Документы
   * 1. Инициализируем список отслежований изменений fields
   * 2. Сортируем наш список по типу документов
   * 3. Смотрим изменение и добавляем в массив изменений
   * 4. Конвертируем наш список на русский язык
   * 5. Отдаем в виде массива.
   */
  displayHistory(history: PatientHistoryDocument[]) {
    const changedHistory = history.reduce((accumulator, current) => {
      const fields = ['series', 'number', 'issuedBy', 'issuedDate', 'isEnabled'];
      if (accumulator[current.documentType.id] === undefined) {
        accumulator[current.documentType.id] = {
          id: current.documentType.id,
          name: current.documentType.name,
          historyChange: []
        };
      }
      const h = accumulator[current.documentType.id].historyChange;
      const prev = h.length > 0 ? h[h.length - 1] : null;
      if (prev !== null) {
        const changed = [];
        for (const field of fields) {
          if (prev[field] !== current[field]) {
            const translate = {
              name: field,
              current: current[field],
              old: prev[field],
              operation: current.operation
            };
            changed.push(this.converterText(translate));
          }
        }
        current.changed = changed;
      }
      accumulator[current.documentType.id].historyChange.push(current);
      return accumulator;
    }, {});
    this.displayDocumentHistory = Object.values(changedHistory);
  }

  /**
   * Получаем общую историю по карточке
   * @param id - нашего пациента
   * Потом после get запроса получаем историю в массиве
   * Этот массив прогоняем через обноружение изменений.
   * Для этого берется две историй и их копий которые очищенные от не нужных данных которые в алгоритм проверки не входят
   */
  getHistory(id: number) {
    this.apiPatient.getHistoryPatient(id).subscribe(
      (response: PatientHistory[]) => {
        this.initHistory = response[0];
        for (const item of response) {
          item.birthdate = PatientHistoryModalComponent.convertDate(item.birthdate);
        }
        if (response.length > 1) {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 1; index < response.length; index++) {
            const historyChanged0 = PatientHistoryModalComponent.filterHistory(
              PatientHistoryModalComponent.copyObjects(response[index - 1]));
            const historyChanged1 = PatientHistoryModalComponent.filterHistory(
              PatientHistoryModalComponent.copyObjects(response[index]));
            this.changeDetectionHistory(response[index - 1], response[index], historyChanged0, historyChanged1);
          }
        }
      }
    );
  }

  getDictionary() {
    this.apiDictionary.getTranslations().subscribe(
      data => {
        this.patientDictionary = data;
        this.getHistory(this.idPatient);
        this.getPatientHistoryDocument(this.idPatient);
      }
    );
  }

  /**
   * Смотрим изменения историй для отоброжение
   * @param historyPrevious - история начальная
   * @param historyChanged - история которая изменилась
   * @param historyPreviousFiltered - отфильтрованная история начальная
   * @param historyChangedFiltered - отфильтрованная история которая изменилась.
   * При обноружений изменений сразу идет в массив пациента.
   * Но перед этим оно прохдит проверку для трансляций значений.
   */
  changeDetectionHistory(historyPrevious: PatientHistory, historyChanged: PatientHistory,
                         historyPreviousFiltered: PatientFilterMain, historyChangedFiltered: PatientFilterMain
  ) {
    for (const [key]  of Object.entries(historyPreviousFiltered)) {
      if (historyPreviousFiltered[key] !== historyChangedFiltered[key]) {
        const changeValue = PatientHistoryModalComponent.patientHistoryDisplayFilter(
          historyChanged, historyChangedFiltered, historyPreviousFiltered, key);
        this.patientHistory.push(this.converterText(changeValue));
      }
    }
  }

  /**
   *  Конвертируем в руский язык (данные типо i- create etc)
   * @param changeValue - Конечный результат которые изменились
   * И в конце добавляет в список историю пациента
   */
  converterText(changeValue) {
    for (const [key] of Object.entries(changeValue)) {
      for (const item of this.patientDictionary) {
        if (changeValue[key] === item.name) {
          changeValue[key] = item.value;
        }
      }
    }
    return changeValue;
  }
}


