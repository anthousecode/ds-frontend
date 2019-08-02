import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {concatMap, delay, retryWhen} from 'rxjs/operators';
import {PatientModel} from '../models/patient.model';
import {SearchQuery} from "../models/patient-search.model";

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
     * @param patient - Query запрос
     * @return Возвращает список нашедших клиентов
     */
    searchPatient$(patient: SearchQuery): Observable<PatientModel[]> {
        return this.http.post<PatientModel[]>(this.patientSearchUrl, patient).pipe(
            retryWhen(errors => errors
                .pipe(
                    concatMap((error, count) => {
                        return count < 5 && (error.status === 400 || error.status === 0) ? of(error.status) : throwError(error);
                    }),
                    delay(1000)
                )
            ));
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
