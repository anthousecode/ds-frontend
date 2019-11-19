export class Decision {
    id: number;
    code?: number;
    stage?: number;
    name?: string;
}

export class MedicalProfile {
    id: number;
    code?: string;
    description?: string;
    subProfile?: MedicalSubProfile;
}

export class MedicalSubProfile {
    id: number;
    name?: string;
    code?: string;
    codeP?: string;
}

export class MedicalProfileDetail {
    id: number;
    description?: string;
    code?: string;
    beginDate?: Date;
    endDate?: Date;
}

export class TerritorialUnit {
    id: number;
    name?: string;
    foCode?: string;
}

export class MedicalInstitution {
    id: number;
    code?: string;
    name?: string;
    fullName?: string;
    childStatus?: number;
    regionName?: string;
    areaName?: string;
    territorialUnit?: TerritorialUnit;
    profiles?: { id: number; medicalProfile: MedicalProfile; }[];
}

export class InsuranceCompany {
    id: number;
    regionCode: number;
    code: string;
    kpp: string;
    name: string;
    shortName: string;
    headSurname: string;
    headName: string;
    headPatronymic: string;
    phone: string;
    fax: string;
    email: string;
    licenseNumber: string;
    licenseDateIssue: string;
    licenseDateExpiration: string;
    registrDateInclusion: string;
    nsiIsActual: number;
    nsiChanged: string;
    nsiVersion: string;
}

export class Organization {
    id: number;
    unq: string;
    fullName: string;
    shortName: string;
    kpp: string;
    inn: string;
    ogrn: string;
    okato: string;
    postIndex: string;
    address: string;
    nsiIsActual: number;
    nsiChanged: string;
    nsiVersion: string;
    oid: string;
    regionId: number;
    territory: Territory;
}

export class EducationalOrganization {
    id: number;
    fullName: string;
    shortName: string;
    regionId: string;
    address: string;
    typeOrgId: number;
    inn: string;
    kpp: string;
    ogrn: string;
    dateBegin: string;
    dateEnd: string;
}

export class StationaryOrganization {
    id: number;
    fullName: string;
    department: Department;
    address: string;
    profileText: string;
    type: StationaryOrganizationType;
    terrKod: number;
    email: string;
    phone: string;
    contacts: string;
    shortName: string;
    oldName: string;
}


export class Country {
    id: number;
    name?: string;
}

export class VmpTypeGroup {
    groupId: number;
}

export class VmpType {
    id?: number;
    name: string;
    code: string;
    subProfile: MedicalSubProfile;
    groupId: number;
}

export class DiseaseModel {
    id: number;
    name: string;
    code: string;
    beginDate?: Date;
    endDate?: Date;
}

export class TreatmentMethod {
    id: number;
    name: string;
    code: string;
}

export class DiseaseCode {
    id: number;
    code?: string;
    name?: string;
}

export class ResponsiblePerson {
    id: number;
    fullName: string;
    position: string;
    phone: string;
    email: string;
    isDefault: boolean;
}

export class PatientDictionary {
    name: string;
    value: string;
}

export class PatientDocumentTypeRegex {
    id: number;
    series: string;
    number: string;
    nameSeries: string;
    nameNumber: string;
}

export class WithoutSnilsReasonType {
    id: number;
    name: string;
}

export interface UserOrganType {
    id: number;
    name: string;
}

export interface RefSex {
    id: number;
    code: number;
    name: string;
    isActual: boolean;
    nsiChanged: string;
    nsiVersion: string;
}

export interface CardType {
    id: number;
    name: string;
}

export interface Territory {
    code: number;
    constitutionCode: string;
    regionName: string;
    codeFo: number;
    dateBegin: string;
    dateEnd: string;
    padezhRod: string;
    padezhPredl: string;
    padezhDat: string;
}

export interface AgeGroup {
    id: number;
    name: string;
}

export interface ChildCategory {
    id: number;
    categoryName: string;
}

export interface Department {
    id: number;
    name: string;
}

export interface StationaryOrganizationType {
    id: number;
    name: string;
}

export interface DevelopmentDisorder {
    id: number;
    name: string;
    parentId: number;
}

export interface MenstrualCharacteristic {
    id: number;
    name: string;
    parentId: number;
}

export interface HealthGroup {
    id: number;
    name: string;
}

export interface SportGroup {
    id: number;
    name: string;
}

export interface DispensaryObservation {
    id: number;
    name: string;
}

export interface TreatmentCondition {
    id: number;
    name: string;
}

export interface ReasonMissed {
    id: number;
    name: string;
}

export interface AbsenceReason {
    id: number;
    name: string;
}

export interface InvalidType {
    id: number;
    name: string;
}

export interface VmpNecessity {
    id: number;
    name: string;
}

export interface ReabilitationStatus {
    id: number;
    name: string;
}

export interface VaccinationStatus {
    id: number;
    name: string;
}

export interface Vaccine {
    id: number;
    name: string;
}

export interface PayOmsStatus {
    id: number;
    name: string;
}

export interface CurrentLocation {
    id: number;
    name: string;
}

export interface TreatmentOrganizationType {
    id: number;
    name: string;
}

export interface DoctorForConclusion {
    id: number;
    surname: string;
    name: string;
    lastname: string;
    organizationOid: number;
    enabled: number;
    created: string;
    updated: string;
    lastUserSave: string;
}

export interface DoctorForExamination {
    id: number;
    name: string;
}

export interface HealthDisorder {
    id: number;
    name: string;
}

export interface InvalidDisease {
    id: number;
    name: string;
    parentId: number;
    mkbCode: number;
}

export interface Examination {
    id: number;
    name: string;
    code: string;
    groupId: number;
}

export interface Mkb10 {
    id: number;
    recCode: string;
    code: string;
    name: string;
    parentId: number;
    addlCode: number;
    nsiIsActual: number;
    nsiVersion: string;
    actual: number;
}

export class Sex {
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
    id: number;
    name: string;
}
