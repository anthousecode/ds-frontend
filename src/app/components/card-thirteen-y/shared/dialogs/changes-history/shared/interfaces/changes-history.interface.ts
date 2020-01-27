export interface IChangesHistory {
    cardStatus: IChangeHistoryItem[];
    card: IChangeHistoryItem[];
    physicalDevelopment: IChangeHistoryItem[];
    mentalDevelopment: IChangeHistoryItem[];
    sexualDevelopment: IChangeHistoryItem[];
    healthStatusBefore: IChangeHistoryItem[];
    diagnosisBefore: IChangeHistoryItem[];
    healthStatusAfter: IChangeHistoryItem[];
    diagnosisAfter: IChangeHistoryItem[];
    disability: IChangeHistoryItem[];
    disabilityDisease: IChangeHistoryItem[];
    disabilityDisorder: IChangeHistoryItem[];
    requiredExamination: IChangeHistoryItem[];
    additionalExamination: IChangeHistoryItem[];
    vaccination: IChangeHistoryItem[];
    vaccinationRequirement: IChangeHistoryItem[];
    conclusion: IChangeHistoryItem[];
    doctorExamination: IChangeHistoryItem[];
}

export interface IChangeHistoryItem {
    operation: string;
    operationDate: string;
    user: string;
    field: IChangeHistoryItemField;
}

export interface IChangeHistoryItemField {
    name: string;
    description: string;
    value: string;
    oldValue?: string;
}
