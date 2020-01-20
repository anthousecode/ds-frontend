export interface IHealthStatusBefore {
  id: number;
  healthGroup: IDiagnosesField;
  healthGood: boolean;
  diagnoses: IDiagnose[];
}

export interface IDiagnose {
  id: number;
  needDispObservation: boolean;
  dispensaryObservation: IDiagnosesField;
  treatmentCondition: IDiagnosesField;
  treatmentConditionOrg: IDiagnosesField;
  treatmentDone: IDiagnosesField;
  treatmentDoneOrg: IDiagnosesField;
  treatmentFailReason: IDiagnosesField;
  treatmentFailReasonOther: string;
  rehabilCondition: IDiagnosesField;
  rehabilConditionOrg: IDiagnosesField;
  rehabilDone: IDiagnosesField;
  rehabilDoneOrg: IDiagnosesField;
  rehabilFailReason: IDiagnosesField;
  rehabilFailReasonOther: string;
  needVmp: IDiagnosesField;
  mkb10: IMkb10;
  createDate: string;
  lastUserSave: number;
}

export interface IMkb10 {
  id: number;
  recCode: string;
  code: string;
  name: string;
  parentId: number;
  addlCode: number;
  nsiIsActual: number;
  nsiVersion: string;
  actual: number;
  createDate: string;
  lastUserSave: number;
}

export interface IDiagnosesField {
  id: number;
  name: string;
}
