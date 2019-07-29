import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PatientSearchModel} from '../models/patient-search.model';

@Injectable({
  providedIn: 'root'
})
/**
 * Сервис для получение данных при поиске
 * Так же подтягивает нужные данные для фильтра поиска
 */
export class PatientSearchService {
  private patientSearchUrl = environment.apiUrl + '/api/patient';

  constructor(private http: HttpClient) {
  }

  /**
   * Поиск нашего клиента через доктарину
   * @param data - Query запрос
   * @return Возвращает список нашедших клиентов
   */
  searchPatient(data): Observable<PatientSearchModel[]> {
    /*  return this.http.post(this.patientSearchUrl, data).pipe(
        retryWhen(errors => errors
          .pipe(
            concatMap((error, count) => {
              return count < 5 && (error.status === 400 || error.status === 0) ? of(error.status) : throwError(error);
            }),
            delay(1000)
          )
        ));*/
    return this.http.get<PatientSearchModel[]>(this.patientSearchUrl);
  }

  getMedicalOrganizations() {
    return this.http.get('');
  }

  getInsuranceCompany() {
    return this.http.get('');
  }

  getDiagnosis() {
    return this.http.get('');
  }

}
