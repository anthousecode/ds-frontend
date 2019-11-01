import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MockService } from '../../../service/mock.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSelect } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { pickerI18n } from '../../talon/talon.component';
import { PatientDocumentsEntity, PatientDocumentType } from '../../../models/patient.model';
import { PatientService } from '../../../service/patient.service';
import { ValidationService } from '../../../service/validation.service';
import { DictionaryService } from '../../../service/dictionary.service';
import { patientDocTypeRegex } from '../../../validators/documents.validator';

const RF_PASSPORT_ID = 14;

export interface ModalDocumentsData {
    documents: PatientDocumentsEntity[];
    updateDoc: PatientDocumentsEntity;
}

@Component({
    selector: 'app-patient-document-modal',
    templateUrl: './patient-document-modal.component.html',
    styleUrls: ['./patient-document-modal.component.sass'],
})

/**
 * Модальное окно для заполенение пасспорта пациента
 * @remarks
 * Модальное окно из подсистемы patient-card
 */
export class PatientDocumentModalComponent implements OnInit {
    constructor(
        private mock: MockService,
        private matDialogRef: MatDialogRef<PatientDocumentModalComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private data: ModalDocumentsData,
        private apiPatient: PatientService,
        private dictionary: DictionaryService,
    ) {
    }

    @ViewChild('monedaSelect') public monedaSelect: MatSelect;

    formModel: { [key in keyof PatientDocumentsEntity]?: FormControl };
    patientDocumentForm: FormGroup;
    pickerI18n = pickerI18n;
    isUnique = true;
    indexItem: number;
    documentsType: PatientDocumentType[];
    allDocumentsType: PatientDocumentType[];
    documents: PatientDocumentsEntity[];
    loading = true;
    documentsEmpty = false;

    ngOnInit() {

        this.documents = this.data.documents;

        this.initForm();
        this.dictionary.getIdentityDocumentTypes().subscribe(
            value => {
                this.allDocumentsType = value;
                this.loading = false;
                if (this.data.updateDoc) {
                    if (this.data.updateDoc.id !== null) {
                        this.patientDocumentForm.controls.type.disable();
                    }
                    this.documentsTypeFilter(value);
                    this.documentsType.push(this.data.updateDoc.type);
                    this.patientDocumentForm.patchValue(this.data);
                    this.changeValueType(this.data.updateDoc.type, true);
                } else {
                    if (this.documents.length !== 0) {
                        this.documentsTypeFilter(value);
                    } else {
                        this.documentsType = value;
                    }
                    if (this.documentsType.length > 0) {
                        this.documentsType.sort((a, b) => a.id > b.id ? 1 : -1);
                        const doc = this.documentsType.find(a => a.id === RF_PASSPORT_ID) || this.documentsType[0];
                        this.monedaSelect._onChange(doc);
                        this.changeValueType(doc);
                    } else {
                        this.documentsEmpty = true;
                    }
                }
            }
        );
    }

    documentsTypeFilter(value: PatientDocumentType[]) {
        this.documentsType = value.filter((obj) => {
            return !this.documents.some((obj2) => {
                return obj.id === obj2.type.id;
            });
        });
    }

    checkValid(nameFormControl: string) {
        return ValidationService.checkValidation(nameFormControl, this.patientDocumentForm);
    }

    /**
     *  Временное хранение
     */
    saveData() {
        if (this.isUnique) {
            this.documents.push(this.patientDocumentForm.value);
        } else {
            this.patientDocumentForm.controls.type.enable();
            this.documents[this.indexItem] = this.patientDocumentForm.value;
        }
        this.matDialogRef.close({ documents: this.documents });
    }


    private initForm(): void {
        this.patientDocumentForm = this.fb.group({
            id: [null],
            documSerial: [null, [Validators.maxLength(50),
                Validators.required, Validators.pattern(patientDocTypeRegex[7].series)]],
            documNumber: [null, [Validators.maxLength(50),
                Validators.required, Validators.pattern(patientDocTypeRegex[7].number)]],
            type: [{disabled: !!this.data.updateDoc}, Validators.required]
        });
        if (this.data.updateDoc) {
            this.isUnique = false;
            this.patientDocumentForm.patchValue(this.data.updateDoc);
            this.indexItem = this.documents.indexOf(this.data.updateDoc);
        }
    }

    /**
     *  @param isOutputDocument - то, что тип документа был взят из сущности пациента
     *  @param event - тип документа пациента
     */
    changeValueType(event: PatientDocumentType, isOutputDocument: boolean = false) {
        if (isOutputDocument) {
            const doc = this.allDocumentsType.filter(value => value.id === event.id);
            doc.length > 0 ? event = doc[0] : event.documSerial = true;
        }
        if (event.documSerial) {
            this.patientDocumentForm.controls.documSerial.enable();
            this.patientDocumentForm.controls.documSerial.setValidators(
                [Validators.pattern(event.validationSerial), Validators.required]
            );
            this.patientDocumentForm.controls.documSerial.updateValueAndValidity();
        } else {
            this.patientDocumentForm.controls.documSerial.disable();
        }
        this.patientDocumentForm.controls.documNumber.setValidators(
            [Validators.pattern(event.validationNumber), Validators.required]
        );
        this.patientDocumentForm.controls.documNumber.updateValueAndValidity();
    }

    compareFn(c1, c2): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }
}
