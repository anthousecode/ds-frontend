export interface TerritorialUnit {
  id: number;
  name: string;
  foCode: string;
}

export interface MedicalInstitution {
  id: number;
  code: string;
  name: string;
  fullName: string;
  childStatus: number;
  regionName: string;
  areaName?: any;
  territorialUnit: TerritorialUnit;
}

export interface HealthAuthority {
  id: number;
  name: string;
  address: string;
  territorialUnit: TerritorialUnit;
}

export interface SubProfile {
  id: number;
  name: string;
  code: string;
  codeP: string;
}

export interface MedicalProfile {
  id: number;
  code: string;
  description: string;
  subProfile: SubProfile;
}

export interface VmpType {
  id: number;
  name: string;
  code: string;
  groupId?: any;
  razdelId: number;
  beginDate: Date;
  endDate: Date;
}

export interface VmpStage1 {
  id: number;
  groupId?: any;
  medicalProfile: MedicalProfile;
  vmpType: VmpType;
  medicalInstitution: MedicalInstitution;
}

export interface Decision {
  id: number;
  code: number;
  stage: number;
  name: string;
  dateEnd: Date;
}

export interface VmpStage2 {
  id: number;
  documentReceiveDate: Date;
  documentRegistrationDate?: any;
  decisionDate: Date;
  plannedDate: Date;
  delayedDate?: any;
  notificationDate: Date;
  noticeType: number;
  responsibleFullName: string;
  approveHospitalizationDate: boolean;
  noticeHealthAuthority: boolean;
  decision: Decision;
}

export interface Talon {
  id: number;
  date: Date;
  uniqNumber: string;
  isEnabled: boolean;
  createDate: Date;
  listWait: boolean;
  isDeclined: boolean;
  hospNextYear: boolean;
  maxEtap: number;
  appealType: number;
  referral: number;
  isOMS: boolean;
  territorialUnit: TerritorialUnit;
  medicalInstitution: MedicalInstitution;
  healthAuthority: HealthAuthority;
  vmpStage1: VmpStage1;
  vmpStage2: VmpStage2;
}

export interface PatientSearch {
  id: number;
  idOuzSave: number;
  isEnabled: boolean;
  sysdInput: Date;
  idMuSave?: any;
  surname: string;
  name: string;
  patronymic: string;
  snils: string;
  isParentDocument?: any;
  idVmpSex: number;
  birthdate: Date;
  idUser: number;
  idLoadedXml?: any;
  talons: Talon[];
}
