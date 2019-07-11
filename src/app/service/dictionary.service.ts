import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {
  Country,
  Decision,
  DiseaseCode,
  DiseaseModel,
  InsuranceCompany,
  MedicalInstitution,
  MedicalProfile,
  PatientDictionary,
  ResponsiblePerson,
  TreatmentMethod,
  VmpType,
  VmpTypeGroup
} from '../interface/dictionary';
import {environment} from '../../environments/environment';
import {FinancingSource, Lgota, Organ, SocialStatus} from '../interface/talon';
import {formatDate} from '@angular/common';
import {PatientDocumentType} from '../interface/patient';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private dictionaryUrl = environment.apiUrl + '/api/dictionary';
  private localDictionaryUrl = '../../assets/dictionary.json';
  responsiblePersons: Observable<ResponsiblePerson[]>;

  constructor(private http: HttpClient) {
  }

  getIdentityDocumentTypes(): Observable<PatientDocumentType[]> {
    return this.http.get<PatientDocumentType[]>(this.dictionaryUrl + '/identity-document-types');
  }

  getDecisions(stage: number): Observable<Decision[]> {
    return this.http.get<Decision[]>(this.dictionaryUrl + '/decisions?stage=' + stage)
      .pipe(
        catchError(this.handleError('getDecisions', []))
      );
  }

  getInsuranceCompanies(name?: string): Observable<InsuranceCompany[]> {
    return this.http.get<InsuranceCompany[]>(this.dictionaryUrl + '/insurance-companies' + (name ? '?name=' + name : ''));
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.dictionaryUrl + '/countries');
  }

  getFinancingSources(): Observable<FinancingSource[]> {
    return this.http.get<FinancingSource[]>(this.dictionaryUrl + '/financing-sources');
  }

  getLgotas(): Observable<Lgota[]> {
    return this.http.get<Lgota[]>(this.dictionaryUrl + '/lgotas');
  }

  getSocialStatuses(): Observable<SocialStatus[]> {
    return this.http.get<SocialStatus[]>(this.dictionaryUrl + '/social-statuses');
  }

  getOrgans(): Observable<Organ[]> {
    return this.http.get<Organ[]>(this.dictionaryUrl + '/organs');
  }

  getMedicalProfiles(date: Date): Observable<MedicalProfile[]> {
    return this.http.get<MedicalProfile[]>(this.dictionaryUrl + '/medical-profiles?'
      + 'date=' + formatDate(date, 'yyyy-MM-dd', 'ru'));
  }

  getVmpTypeGroups(date: Date, razdel: number, profileId: number): Observable<VmpTypeGroup[]> {
    return this.http.get<VmpTypeGroup[]>(this.dictionaryUrl
      + '/vmp-type-groups?date=' + formatDate(date, 'yyyy-MM-dd', 'ru')
      + '&razdel=' + razdel + '&profile_id=' + profileId);
  }

  getVmpTypes(date: Date, razdel: number, profileId: number, group: number): Observable<VmpType[]> {
    return this.http.get<VmpType[]>(this.dictionaryUrl
      + '/vmp-types?date=' + formatDate(date, 'yyyy-MM-dd', 'ru')
      + '&razdel=' + razdel + '&profile_id=' + profileId
      + '&group=' + group
    );
  }

  getDiseaseModels(date: Date, razdel: number, vmpTypeId: number): Observable<DiseaseModel[]> {
    return this.http.get<DiseaseModel[]>(this.dictionaryUrl
      + '/disease-models?date=' + formatDate(date, 'yyyy-MM-dd', 'ru')
      + '&razdel=' + razdel + '&vmp_type_id=' + vmpTypeId
    );
  }

  getTreatmentMethods(date: Date, razdel: number, vmpTypeId: number, diseaseModelId: number): Observable<TreatmentMethod[]> {
    return this.http.get<TreatmentMethod[]>(this.dictionaryUrl
      + '/treatment-methods?date=' + formatDate(date, 'yyyy-MM-dd', 'ru')
      + '&razdel=' + razdel + '&vmp_type_id=' + vmpTypeId
      + '&disease_model_id=' + diseaseModelId
    );
  }

  getMedicalInstitutions(
    talonId: number,
    medicalProfileId: number,
    groupId: number,
    vmpTypeId: number
  ): Observable<MedicalInstitution[]> {
    return this.http.get<MedicalInstitution[]>(this.dictionaryUrl
      + '/medical-institutions?talon_id=' + talonId + '&medical_profile_id=' + medicalProfileId
      + '&group_id=' + groupId + '&vmp_type_id=' + vmpTypeId
    );
  }

  getDiseaseCodes(term: string): Observable<DiseaseCode[]> {
    return this.http.get<DiseaseCode[]>(this.dictionaryUrl
      + '/disease-codes?term=' + term
    );
  }

  getResponsiblePersons(): Observable<ResponsiblePerson[]> {
    if (this.responsiblePersons === null) {
      this.responsiblePersons = this.http.get<ResponsiblePerson[]>(this.dictionaryUrl + '/responsible-persons');
    }
    return this.responsiblePersons;
  }

  getTranslations(): Observable<PatientDictionary[]> {
    return this.http.get<PatientDictionary[]>(this.localDictionaryUrl);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // noinspection JSMethodCanBeStatic
  /** Log message */
  private log(message: string) {
    console.log(message);
  }
}
