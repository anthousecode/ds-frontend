import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { concatMap, delay, map, retryWhen } from 'rxjs/operators';
import {Patient} from '../models/patient.model';
import {SearchQuery} from '../models/patient-search.model';
import * as FileSaver from 'file-saver';

@Injectable({
    providedIn: 'root'
})
/**
 * Сервис для получение данных при поиске
 * Так же подтягивает нужные данные для фильтра поиска
 */
export class PatientSearchService {
    private patientSearchUrl = environment.apiUrl + '/api/patient';
    private patientExportUrl = environment.apiUrl + '/api/patients-export';

    constructor(
        private http: HttpClient,
    ) {
    }

    /**
     * Поиск нашего клиента через доктарину
     * @param patient - Query запрос
     * @return Возвращает список нашедших клиентов
     */
    searchPatient$(patient: SearchQuery): Observable<Patient[]> {
        return this.http.post<Patient[]>(this.patientSearchUrl, patient).pipe(
            retryWhen(errors => errors
                .pipe(
                    concatMap((error, count) => {
                        return count < 5 && (error.status === 400 || error.status === 0) ? of(error.status) : throwError(error);
                    }),
                    delay(1000)
                )
            ));
    }

    getExport(params: HttpParams, format: string): Observable<HttpResponse<Blob>> {
        params = params.set('format', format);
        return this.http.get(this.patientExportUrl, {params, observe: 'response', responseType: 'blob'})
            .pipe(map( value => {
                FileSaver.saveAs(value.body, this.filenameSlice(value.headers.get('Content-Disposition'), format));
                return value;
            }));
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

    filenameSlice(header: string, format: string) {
        if (header && header.includes('filename')) {
            const result = header.split(';')[1].trim().split('=')[1];
            return decodeURI(result.replace(/"/g, ''));
        } else {
            return 'Список детей.' + format;
        }
    }

}
