import {Component, Inject, OnInit} from '@angular/core';
import {MockService} from '../../../service/mock.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {pickerI18n} from '../../talon/talon.component';
import {PatientDocumentsEntity, PatientDocumentType} from '../../../models/patient.model';
import {PatientService} from '../../../service/patient.service';
import {ValidationService} from '../../../service/validation.service';
import {DictionaryService} from '../../../service/dictionary.service';
import {patientDocTypeRegex} from '../../../validators/documents.validator';

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
    constructor(private mock: MockService,
                private matDialogRef: MatDialogRef<PatientDocumentModalComponent>,
                private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) private data: PatientDocumentsEntity,
                private apiPatient: PatientService,
                private dictionary: DictionaryService,
    ) {
    }

    formModel: { [key in keyof PatientDocumentsEntity]?: FormControl } = {
        id: new FormControl(null),
        documSerial: new FormControl(null, [Validators.maxLength(50),
            Validators.required, Validators.pattern(patientDocTypeRegex[7].series)]),
        documNumber: new FormControl(null, [Validators.maxLength(50),
            Validators.required, Validators.pattern(patientDocTypeRegex[7].number)]),
        type: new FormControl(null, Validators.required)
    };
    patientDocumentForm: FormGroup = new FormGroup(this.formModel);
    pickerI18n = pickerI18n;
    isUnique = true;
    indexItem: number;
    documentsType: PatientDocumentType[];

    ngOnInit() {
        this.dictionary.getIdentityDocumentTypes().subscribe(
            value => {
                if (this.data) {
                    this.documentsType = value;
                    this.patientDocumentForm.patchValue(this.data);

                } else {
                    if (this.apiPatient.state.length !== 0) {
                        this.documentsType = value.filter((obj) => {
                            return !this.apiPatient.state.some((obj2) => {
                                return obj.idRef === obj2.type.idRef;
                            });
                        });
                    } else {
                        this.documentsType = value;
                    }
                }
            }
        );
    }

    checkValid(nameFormControl: string) {
        return ValidationService.checkValidation(nameFormControl, this.patientDocumentForm);
    }

    /**
     *  Временное хранение
     */
    saveData() {
        if (this.isUnique) {
            this.apiPatient.state.push(this.patientDocumentForm.value);
        } else {
            this.apiPatient.state[this.indexItem] = this.patientDocumentForm.value;
        }
        this.matDialogRef.close();
    }

    changeValueType(event) {
        for (const itemIn of patientDocTypeRegex) {
            if (event.id === itemIn.id) {
                this.patientDocumentForm.controls.documSerial.setValidators([Validators.pattern(itemIn.series), Validators.required]);
                this.patientDocumentForm.controls.documNumber.setValidators([Validators.pattern(itemIn.number), Validators.required]);
                this.patientDocumentForm.controls.documSerial.updateValueAndValidity();
                this.patientDocumentForm.controls.documNumber.updateValueAndValidity();
                break;
            } else {
                this.patientDocumentForm.controls.documNumber.reset();
                this.patientDocumentForm.controls.documSerial.reset();
                this.patientDocumentForm.controls.documSerial.setValidators([Validators.pattern(patientDocTypeRegex[7].series), Validators.required]);
                this.patientDocumentForm.controls.documNumber.setValidators([Validators.pattern(patientDocTypeRegex[7].number), Validators.required]);
                this.patientDocumentForm.controls.documSerial.updateValueAndValidity();
                this.patientDocumentForm.controls.documNumber.updateValueAndValidity();
            }
        }
    }

    compareFn(c1: PatientDocumentsEntity, c2: PatientDocumentsEntity): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }
}
