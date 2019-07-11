import {
  Country,
  Decision,
  DiseaseCode,
  DiseaseModel,
  InsuranceCompany,
  MedicalInstitution,
  MedicalProfile,
  MedicalProfileDetail,
  TerritorialUnit,
  TreatmentMethod,
  VmpType
} from './dictionary';
import {Patient} from './patient';

export class FiasAddress {
  id: number = null;
  streetName?: string = null;
  isCity = true;
  homeNumber?: string = null;
  housingNumber?: string = null;
  flatNumber?: string = null;
  postIndex?: number = null;
}

export class SocialStatus {
  id: number;
  description?: string;
  code?: string;
}

export class Lgota {
  id: number;
  description?: string;
  code?: string;
}


export class VmpStage0 {

  constructor() {
    this.fiasAddress = new FiasAddress();
  }

  numPolis: string = null;
  lastUserId?: number = null;
  socialStatus: SocialStatus = {id: null};
  lgota: Lgota = {id: null};
  fiasAddress: FiasAddress;
  insuranceCompany: InsuranceCompany;
  country?: Country = null;
  contactData?: string = null;
  email: string = null;
  readyUsedate?: number = null;
}

export class VmpStage1 {
  responsibleFullName: string;
  docSendDate: Date;
  diseaseCode: DiseaseCode;
  medicalProfile: MedicalProfile;
  vmpType: VmpType;
  medicalProfileDetail: MedicalProfileDetail;
  medicalInstitution: MedicalInstitution;
  decision: Decision;
  decisionDate: Date;
  model: DiseaseModel;
  method: TreatmentMethod;
}

export class TalonUniqueNumber {
  id: number;
  uniqNumber?: string;
  transferDate?: Date;
  talonDate?: Date;
}


export class FinancingSource {
  id: number;
  description?: string;
  idRazdel?: number;
  parentId?: number;
}

export class Organ {
  id: number;
  description?: string;
}

export class Talon {
  static readonly APPEAL_TYPE_PRIMARY = 1;
  static readonly APPEAL_TYPE_SECONDARY = 2;
  static readonly REFERRAL_OUZ = 0;
  static readonly REFERRAL_MU = 1;
  static readonly REFERRAL_EMERGENCY = 2;
  id?: number;
  date: Date;
  uniqNumber: string;
  isEnabled: boolean;
  createDate?: Date;
  modificationDate?: Date;
  listWait: boolean;
  isDeclined: boolean;
  hospNextYear: boolean;
  maxEtap?: number;
  appealType = Talon.APPEAL_TYPE_PRIMARY;
  referral = Talon.REFERRAL_OUZ;
  organ?: Organ;
  isOMS: boolean;
  territorialUnit: TerritorialUnit;
  healthAuthority: { id: number; name?: string; address?: string; territorialUnit?: { id: number; name?: string; foCode?: string; } };
  financingSource: FinancingSource = new FinancingSource();
  prevUniqNumbers?: TalonUniqueNumber[];
  vmpStage0: VmpStage0;
  vmpStage1: VmpStage1;
  vmpStage2: VmpStage2;
  vmpStage3: VmpStage3;
  patient: Patient;
}

export class Access {
  rules: { [rule: string]: number };
}

export class TalonResponse {
  talon: Talon;
  access: Access;
}

export class VmpStage2 {
  id?: number;
  documentReceiveDate: Date;
  documentRegistrationDate: Date;
  decision: Decision;
  decisionDate: Date;
  vmpType?: VmpType;
  plannedDate: Date;
  delayedDate: Date;
  notificationDate: Date;
  noticeType: number;
  responsibleFullName: string;
  approveHospitalizationDate: boolean;
  noticeHealthAuthority: boolean;
}

export class VmpStage3 {
  id?: number;
}
