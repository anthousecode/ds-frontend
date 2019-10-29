import {Sex} from './dictionary.model';

export interface Patient {
    id: number;
    unqId: number;
    lastName: string;
    firstName: string;
    patronymic: string;
    sex: Sex;
    birthdate: Date;
    snils: string;
    withoutSnilsReason: WithoutSnilsReasonType;
    withoutSnilsReasonOther: string;
    patientDocuments?: (PatientDocumentsEntity)[] | null;
}

export interface PatientDocumentsEntity {
    id: number;
    documSerial: string;
    documNumber: string;
    type: PatientDocumentType;
}

export interface WithoutSnilsReasonType {
    id: number;
    name: string;
}

export interface PatientDocumentType {
    id: number;
    idRef: string;
    name: string;
    code: number;
}

export interface PatientHistoryDocument {
    id: number;
    operation: string;
    operationDate: string;
    lastUserSave: string;
    username: string;
    osUser: string;
    documSerial: string;
    documNumber: string;
    isEnabled: boolean;
    type: PatientDocumentType;
    changed: any[];
}

export interface PatientHistoryDisplay {
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

export interface PatientHistory {
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


export interface PatientHistoryDocumentDisplay {
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

export interface PatientSendAPI {
    patient: Patient;
}

export class PatientSearchResult {
    count: number;
    patients: Patient[];
}
