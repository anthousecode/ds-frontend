export class PatientDocument {
    id: number;
    series: number;
    number: number;
    issuedBy: string;
    issuedDate: number;
    isEnabled: boolean;
    type: PatientDocumentType;
}

export class PatientDocumentType {
    id: number;
    name: string;
    code: string;
    isEnabled: boolean;
}

export class PatientModel {
    birthdate: string;
    id: number;
    idLoadedXml: any;
    idMuSave: any;
    idOuzSave: number;
    idUser: number;
    idVmpSex: number;
    isEnabled: boolean;
    name: string;
    parentDocnum: boolean;
    patronymic: string;
    snils: string;
    surname: string;
    sysdInput: string;
    identityDocuments: PatientDocument;
    documents: ExternalDocument[];
    talons: Talon[];
    inn: string;
}

export class PatientHistory {
    id: number;
    operationDate: string;
    operation: string;
    username: string;
    osUser: string;
    machine: string;
    program: string;
    idOuzSave: number;
    isEnabled: boolean;
    idMuSave: number;
    surname: string;
    name: string;
    patronymic: string;
    snils: string;
    isParentDocument: boolean;
    idVmpSex: number;
    birthdate: string;
    idUser: number;
    idLoadedXml: string;
    changed: any[];
}

export class PatientHistoryDocument {
    id: number;
    operation: string;
    username: string;
    osUser: string;
    machine: string;
    program: string;
    operationDate: string;
    patientId: number;
    series: string;
    number: string;
    issuedBy: string;
    issuedDate: string;
    isEnabled: boolean;
    documentType: PatientDocumentType;
    changed: any[];
}

export class PatientHistoryDisplay {
    id: number;
    name: string;
    historyChange: [
        PatientHistory,
        {
            changed: [
                {
                    name: string,
                    current: string,
                    old: string,
                    operation: string
                }
                ]
        }
        ];
}

export class PatientFilterMain {
    username: string;
    osUser: string;
    surname: string;
    name: string;
    patronymic: string;
    snils: string;
    idVmpSex: number;
    birthdate: string;
}

export class PatientHistoryDocumentDisplay {
    id: number;
    name: string;
    historyChange: [
        PatientHistoryDocument,
        {
            changed: [
                {
                    name: string,
                    current: string,
                    old: string,
                    operation: string
                }
                ]
        }
        ];
}

export class ExternalDocument {
    id: number;
    date: Date;
    fileName: string;
}

export class SubProfile {
    code: string;
    codeP: string;
}

export class MedicalProfile {
    subProfile: SubProfile;
}

export class VmpType {
    code: string;
}

export class VmpStage1 {
    medicalProfile: MedicalProfile;
    vmpType: VmpType;
}

export class Talon {
    id: number;
    uniqNumber: string;
    medicalInstitution?: any;
    vmpStage1: VmpStage1;
}
