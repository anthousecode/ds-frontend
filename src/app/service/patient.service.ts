import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {concatMap, delay, retryWhen} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import { Patient, PatientDocumentsEntity, PatientSearchResult, PatientSendAPI } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(private http: HttpClient) {
  }

  public state: PatientDocumentsEntity[] = [];
  private patientUrl = environment.apiUrl + '/api/patients';

  /**
   *  Get запрос для получениие данных об пациенте
   * @param id:documNumber Пациента которого мы ищем
   * @return error - еслии евсть ошибка , если все нормально то о отдает json вида PatientCard
   */
  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(this.patientUrl + '/' + id).pipe(
      retryWhen(errors => errors
        .pipe(
          concatMap((error, count) => {
            this.handleError(error);
            return count < 5 && (error.status === 500 || error.status === 0) ? of(error.status) : throwError(error);
          }),
          delay(1000)
        )
      ));
  }

    searchPatient$(params: HttpParams): Observable<PatientSearchResult> {
        return this.http.get<PatientSearchResult>(this.patientUrl, {params});
    }

  /**
   * Для обновление данных
   * @param changeData Данные которые нужно изменить
   * @return Observable чтобы подпистаься и получить данные.
   */
  updatePatient(changeData: PatientSendAPI): Observable<Patient> {
    return this.http.put<Patient>(this.patientUrl + '/' + changeData.patient.id, changeData).pipe(
      retryWhen(errors => errors
        .pipe(
          concatMap((error, count) => {
            this.handleError(error);
            return count < 5 && (error.status === 500 || error.status === 0) ? of(error.status) : throwError(error);
          }),
          delay(1000)
        )));
  }

  /**
   * Создание Пациента если его нет в системе
   * @param patient Обьект тип PatientModel
   * @return Возращает статус создание
   */
  createPatient(patient: PatientSendAPI): Observable<Patient> {
    return this.http.post<Patient>(this.patientUrl, patient).pipe(
      retryWhen(errors => errors
        .pipe(
          concatMap((error, count) => {
            this.handleError(error);
            return count < 5 && (error.status === 500 || error.status === 0) ? of(error.status) : throwError(error);
          }),
          delay(1000)
        )));
  }

  /**
   * Для получение историй пациента
   * @param id - идинтификатор пользователя
   */
  getHistoryPatient(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.patientUrl + '/' + id + '/change-log').pipe(
      retryWhen(errors => errors
        .pipe(
          concatMap((error, count) => {
            this.handleError(error);
            return count < 5 && (error.status === 500 || error.status === 0) ? of(error.status) : throwError(error);
          }),
          delay(1000)
        )));
  }

  /**
   * Получение историй документов Пациентп
   * @param id - пациента
   * @return Возвращает список историю изменений
   */
  getHistoryPatientDocument(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.patientUrl + '/' + id + '/patient-document-change-log').pipe(
      retryWhen(errors => errors
        .pipe(
          concatMap((error, count) => {
            this.handleError(error);
            return count < 5 && (error.status === 500 || error.status === 0) ? of(error.status) : throwError(error);
          }),
          delay(1000)
        )));
  }

  /**
   * Для отлова ошибок по api запросам
   * @param operation какое взаимодействие с бэкендом
   * @param result тип ошишбки
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (): Observable<T> => {
      this.iterate(result, '');
      return of(result as T);
    };
  }


  iterate(obj, stack) {
    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (typeof obj[property] === 'object') {
          this.iterate(obj[property], stack + '.' + property);
        } else {
          console.log(property + '   ' + obj[property] + '  ' + stack);
        }
      }
    }
  }
}
