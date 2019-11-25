import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
    AbsenceReason,
    AgeGroup,
    CardType,
    ChildCategory,
    Country,
    CurrentLocation,
    Decision,
    DevelopmentDisorder,
    DiseaseCode,
    DiseaseModel,
    DispensaryObservation,
    DoctorForConclusion,
    DoctorForExamination,
    EducationalOrganization,
    Examination,
    HealthDisorder,
    HealthGroup,
    InsuranceCompany,
    InvalidDisease, InvalidType,
    MedicalInstitution,
    MedicalProfile,
    MenstrualCharacteristic,
    Mkb10,
    Organization,
    PatientDictionary,
    PayOmsStatus,
    ReabilitationStatus,
    ReasonMissed,
    RefSex,
    ResponsiblePerson,
    Sex,
    SportGroup,
    StationaryOrganization,
    Territory,
    TreatmentCondition,
    TreatmentMethod,
    TreatmentOrganizationType,
    UserOrganType,
    VaccinationStatus,
    Vaccine,
    VmpNecessity,
    VmpType,
    VmpTypeGroup
} from '../models/dictionary.model';
import { environment } from '../../environments/environment';
import { FinancingSource, Lgota, Organ, SocialStatus } from '../models/talon.model';
import { formatDate } from '@angular/common';
import { PatientDocumentType } from '../models/patient.model';
import { NoSnilsReasonModel } from '../models/noSnilsReason.model';

@Injectable({
    providedIn: 'root'
})
export class DictionaryService {
    private dictionaryUrl = environment.apiUrl + '/api/dictionary';
    private localDictionaryUrl = '../../assets/dictionary.json';
    responsiblePersons: Observable<ResponsiblePerson[]>;

    constructor(private http: HttpClient) {
    }

    getWithoutSnilsReasonType(): Observable<NoSnilsReasonModel[]> {
        return this.http.get<NoSnilsReasonModel[]>(this.dictionaryUrl + '/without-snils-reason-type');
    }

    getIdentityDocumentTypes(): Observable<PatientDocumentType[]> {
        return this.http.get<PatientDocumentType[]>(this.dictionaryUrl + '/patient-document-types');
    }

    getDecisions(stage: number): Observable<Decision[]> {
        return this.http.get<Decision[]>(this.dictionaryUrl + '/decisions?stage=' + stage)
            .pipe(
                catchError(this.handleError('getDecisions', []))
            );
    }

    getInsuranceCompanies(page = 1, pagesize: number, name?: string): Observable<InsuranceCompany[]> {
        const params = this.getParamsForPaginationArguments(page, pagesize, name);

        return this.http.get<InsuranceCompany[]>(this.dictionaryUrl + '/insurance-companies', {params});
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

    getSexes(): Sex[] {
        return [new Sex(1, 'Мужской'), new Sex(2, 'Женский')];
    }

    getUserOrganTypes(): Observable<UserOrganType[]> {
        return this.http.get<UserOrganType[]>(this.dictionaryUrl + '/user-organ-types');
    }

    getRefSex(): Observable<RefSex[]> {
        return this.http.get<RefSex[]>(this.dictionaryUrl + '/ref-sex');
    }

    getCardTypes(): Observable<CardType[]> {
        return this.http.get<CardType[]>(this.dictionaryUrl + '/card-types');
    }

    getTerritories(): Observable<Territory[]> {
        return this.http.get<Territory[]>(this.dictionaryUrl + '/territories');
    }

    getAgeGroups(): Observable<AgeGroup[]> {
        return this.http.get<AgeGroup[]>(this.dictionaryUrl + '/age-groups');
    }

    getChildCategories(): Observable<ChildCategory[]> {
        return this.http.get<ChildCategory[]>(this.dictionaryUrl + '/child-categories');
    }

    getOrganizations(page = 1, pagesize: number, name?: string): Observable<Organization[]> {
        const params = this.getParamsForPaginationArguments(page, pagesize, name);

        return this.http.get<Organization[]>(this.dictionaryUrl + '/organizations', {params});
    }

    getEducationalOrganizations(page = 1, pagesize: number, name?: string): Observable<EducationalOrganization[]> {
        const params = this.getParamsForPaginationArguments(page, pagesize, name);

        return this.http.get<EducationalOrganization[]>(this.dictionaryUrl + '/educational-organizations', {params});
    }

    getStationaryOrganizations(page = 1, pagesize: number, name?: string): Observable<StationaryOrganization[]> {
        const params = this.getParamsForPaginationArguments(page, pagesize, name);

        return this.http.get<StationaryOrganization[]>(this.dictionaryUrl + '/stationary-organizations', {params});
    }

    getDevelopmentDisorders(): Observable<DevelopmentDisorder[]> {
        return this.http.get<DevelopmentDisorder[]>(this.dictionaryUrl + '/development-disorders');
    }

    getMenstrualCharacteristics(): Observable<MenstrualCharacteristic[]> {
        return this.http.get<MenstrualCharacteristic[]>(this.dictionaryUrl + '/menstrual-characteristics');
    }

    getHealthGroups(): Observable<HealthGroup[]> {
        return this.http.get<HealthGroup[]>(this.dictionaryUrl + '/health-groups');
    }

    getSportGroups(): Observable<SportGroup[]> {
        return this.http.get<SportGroup[]>(this.dictionaryUrl + '/sport-groups');
    }

    getDispensaryObservations(): Observable<DispensaryObservation[]> {
        return this.http.get<DispensaryObservation[]>(this.dictionaryUrl + '/dispensary-observations');
    }

    getTreatmentConditions(): Observable<TreatmentCondition[]> {
        return this.http.get<TreatmentCondition[]>(this.dictionaryUrl + '/treatment-conditions');
    }

    getMissedReasons(): Observable<ReasonMissed[]> {
        return this.http.get<ReasonMissed[]>(this.dictionaryUrl + '/missed-reasons');
    }

    getAbsenceReasons(): Observable<AbsenceReason[]> {
        return this.http.get<AbsenceReason[]>(this.dictionaryUrl + '/absence-reasons');
    }

    getInvalidTypes(): Observable<InvalidType[]> {
        return this.http.get<InvalidType[]>(this.dictionaryUrl + '/invalid-types');
    }


    getVmpNecessities(): Observable<VmpNecessity[]> {
        return this.http.get<VmpNecessity[]>(this.dictionaryUrl + '/vmp-necessities');
    }

    getMkb10s(page = 1, pagesize: number, name?: string): Observable<Mkb10[]> {
        const params = this.getParamsForPaginationArguments(page, pagesize, name);

        return this.http.get<Mkb10[]>(this.dictionaryUrl + '/mkb10s', {params});
    }

    getReabilitationStatuses(): Observable<ReabilitationStatus[]> {
        return this.http.get<ReabilitationStatus[]>(this.dictionaryUrl + '/reabilitation-statuses');
    }

    getHealthDisorders(): Observable<HealthDisorder[]> {
        return this.http.get<HealthDisorder[]>(this.dictionaryUrl + '/health-disorders');
    }

    getInvalidDiseases(): Observable<InvalidDisease[]> {
        return this.http.get<InvalidDisease[]>(this.dictionaryUrl + '/invalid-diseases');
    }

    getExaminations(page = 1, pagesize: number, name?: string): Observable<Examination[]> {
        const params = this.getParamsForPaginationArguments(page, pagesize, name);

        return this.http.get<Examination[]>(this.dictionaryUrl + '/examinations', {params});
    }

    getVaccinationStatuses(): Observable<VaccinationStatus[]> {
        return this.http.get<VaccinationStatus[]>(this.dictionaryUrl + '/vaccination-statuses');
    }

    getVaccines(): Observable<Vaccine[]> {
        return this.http.get<Vaccine[]>(this.dictionaryUrl + '/vaccines');
    }

    getOmsPaymentStatuses(): Observable<PayOmsStatus[]> {
        return this.http.get<PayOmsStatus[]>(this.dictionaryUrl + '/oms-payment-statuses');
    }

    getCurrentLocations(): Observable<CurrentLocation[]> {
        return this.http.get<CurrentLocation[]>(this.dictionaryUrl + '/current-locations');
    }

    getTreatmentOrganizationTypes(): Observable<TreatmentOrganizationType[]> {
        return this.http.get<TreatmentOrganizationType[]>(this.dictionaryUrl + '/treatment-organization-types');
    }

    getDoctorsForConslusion(): Observable<DoctorForConclusion[]> {
        return this.http.get<DoctorForConclusion[]>(this.dictionaryUrl + '/doctors-for-conslusion');
    }

    getDoctorsForExamination(): Observable<DoctorForExamination[]> {
        return this.http.get<DoctorForExamination[]>(this.dictionaryUrl + '/doctors-for-examination');
    }



    getParamsForPaginationArguments(page: number, pagesize: number, name?: string): HttpParams {
        let params = new HttpParams();
        if (page) { params = params.set('page', page.toString()); }
        if (pagesize) { params = params.set('pagesize', pagesize.toString()); }
        if (name) { params = params.set('name', name); }
        return params;
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
