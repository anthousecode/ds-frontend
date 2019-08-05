export interface Patient {
    id: number;
    unqId: number;
    lastName: string;
    firstName: string;
    patronymic: string;
    sex: number;
    birthdate: Date;
    snils: string;
    withoutSnilsReason: string;
    createDate: string;
    lastUserId: number;
    patientDocuments?: (PatientDocumentsEntity)[] | null;
}
export interface PatientDocumentsEntity {
    id: number;
    documSerial: string;
    documNumber: string;
    createDate: string;
    lastUserId: number;
    type: Type;
}
export interface Type {
    id: number;
    idRef: string;
    name: string;
}
export interface PatientHistoryDocument {
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
    documentType: PatientDocumentsEntity;
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
