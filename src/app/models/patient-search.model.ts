export interface InputChips {
    inputValue: string;
}


export interface SearchQuery {
    pagesize: number;
    page: string;
    name: string;
    surname: string;
    patronymic: string;
    snils: string;
    birthdate_from: string;
    birthdate_to: string;
    sex: number;
    policy_number: number;
    medical_institution: number;
    disease_code_before: number;
    disease_code_after: number;
    insurance_company: number;
    disabled: number;
    age_group: number;
    parent_document: number;
}
