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
  name?: string;
  code?: string;
  territorialUnit?: TerritorialUnit;
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
