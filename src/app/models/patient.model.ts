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
