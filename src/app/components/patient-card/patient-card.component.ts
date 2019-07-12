import {Component, OnInit} from '@angular/core';
import {Patient, PatientDocument, PatientHistory} from '../../interface/patient';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {PatientDocumentModalComponent} from './patient-document-modal/patient-document-modal.component';
import {MockService} from '../../service/mock.service';
import {ActivatedRoute} from '@angular/router';
import {PatientService} from '../../service/patient.service';
import {PatientHistoryModalComponent} from './patient-history-modal/patient-history-modal.component';
import {PatientUnionModalComponent} from './patient-union-modal/patient-union-modal.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as M from 'materialize-css/dist/js/materialize';
import {ValiedateSnilsRequired} from '../../validators/snils.validator';
import {ValidationService} from '../../service/validation.service';
import {DateValidator} from '../../validators/date.validator';
import * as moment from 'moment';
import {regexMapVal} from '../../directive/validation.directive';
import {ValidateINN} from '../../validators/inn.validator';

export interface PeriodicElement {
    card: number;
    type_card: string;
    status: string;
    ageGroup: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {card: 121321313, type_card: 'Просто отдыхает', status: 'На утверждений', ageGroup: 14},
    {card: 22132131, type_card: 'Коксом обнюхался', status: 'Утверждена', ageGroup: 15},
    {card: 321321321, type_card: 'Алкоголик', status: 'Не бро', ageGroup: 17},
];


@Component({
    selector: 'app-patient-card',
    templateUrl: './patient-card.component.html',
    styleUrls: ['./patient-card.component.sass']
})
export class PatientCardComponent implements OnInit {
    dialogConfig = new MatDialogConfig();
    patientForm: FormGroup;
    isPresentPatient = false;
    patientHistory: PatientHistory[];
    patientAddInfo = true;
    idPatient: number;
    ValiedateSnils = ValiedateSnilsRequired;
    today = new Date().toJSON().split('T')[0];
    isParentDocument = true;
    lastYear = moment().subtract(1, 'years');
    PatientFullInformation: Patient;
    displayedColumns: string[] = ['card', 'type_card', 'status', 'ageGroup'];
    dataSource = ELEMENT_DATA;

    constructor(public dialog: MatDialog,
                private mock: MockService,
                private route: ActivatedRoute,
                private api: PatientService,
                private fb: FormBuilder,
    ) {
    }

    createPatientDoc() {
        this.dialog.open(PatientDocumentModalComponent, this.dialogConfig);
    }

    updatePatientDoc(item: PatientDocument) {
        this.dialogConfig.data = item;
        this.dialog.open(PatientDocumentModalComponent, this.dialogConfig);
        delete this.dialogConfig.data;
    }

    openPatientUnion() {
        this.dialog.open(PatientUnionModalComponent, this.dialogConfig);
    }

    /**
     * Отдельный стиль для историй
     */
    openPatientHistory() {
        const dialogHistoryConfig = new MatDialogConfig();
        dialogHistoryConfig.width = '55%';
        dialogHistoryConfig.height = '70%';
        dialogHistoryConfig.data = this.idPatient;
        dialogHistoryConfig.panelClass = 'custom-dialog-container';
        this.dialog.open(PatientHistoryModalComponent, dialogHistoryConfig);
    }

    /**
     * Инициализация id - для получение информацию об пациенте.
     * Настройка наших модальных окон.
     * Инициализация реактивной формы.
     */
    ngOnInit() {
        const params = this.route.snapshot.paramMap;
        if (params.has('id')) {
            this.getPatenInfo(Number(params.get('id')));
        }
        this.initForm();
        this.dialogConfig.disableClose = false;
        this.dialogConfig.autoFocus = true;
        this.dialogConfig.hasBackdrop = true;
        this.dialogConfig.backdropClass = '';
        this.dialogConfig.width = '55%';
        this.dialogConfig.maxHeight = '70%';
    }

    /**
     * Удаление из нашего массива документов
     * @param index нашего документа
     */
    deleteState(index: number) {
        if ((index > -1 && this.api.state.length > 1) || !this.isPresentPatient) {
            this.api.state.splice(index, 1);
            M.toast({html: 'Документ удален'});
        }
    }

    /**
     * Получение данных нашего пациента если есть
     * После получение сразу получаем историю пациента
     * И мерджим наши документы
     * @param id Пациента
     */
    getPatenInfo(id: number) {
        this.api.getPatient(id).subscribe(
            (response) => {
                this.PatientFullInformation = response;
                this.isPresentPatient = true;
                this.patientForm.patchValue(response);
                this.api.state = this.api.state.concat(response.identityDocuments);
                this.idPatient = response.id;
                this.statusParentDocControl(response);
            }
        );
    }

    statusParentDocControl(response: Patient) {
        if (moment() > moment(response.birthdate) && this.lastYear < moment(response.birthdate)) {
            this.patientForm.controls.parentDocnum.enable();
        } else {
            this.patientForm.controls.parentDocnum.disable();
        }
    }

    savePatientInfo() {
        this.patientForm.value.identityDocuments = this.api.state;
        const sendData: Patient = this.patientForm.value;
        if (this.isPresentPatient) {
            this.api.updatePatient(sendData).subscribe(
                () => {
                    console.log('Uraa');
                }, error => {
                    console.log(error);
                }
            );
        } else {
            this.api.createPatient(sendData).subscribe(
                () => {
                    console.log('Save Data');
                }, error => {
                    console.log(error);
                }
            );
        }
    }

    /**
     * Инициализация нашей реактивной формы.
     */
    private initForm(): void {
        this.patientForm = this.fb.group({
            id: [null],
            idLoadedXml: [null],
            idMuSave: [null],
            idOuzSave: [null],
            idUser: [null],
            idVmpSex: [1],
            isEnabled: [null],
            sysdInput: [null],
            birthdate: [null, [Validators.required, DateValidator]],
            name: [null, [Validators.maxLength(50), Validators.required, Validators.pattern(regexMapVal.name)]],
            snils: [null, [ValiedateSnilsRequired]],
            surname: [null, [Validators.maxLength(50), Validators.required, Validators.pattern(regexMapVal.name)]],
            parentDocnum: [{value: false, disabled: this.isParentDocument}],
            patronymic: [null],
            documents: [null],
            talons: [null],
            check: [null, [ValidateINN]]
        });

        this.patientForm.controls.birthdate.valueChanges.subscribe(value => {
            if (moment() > moment(value) && this.lastYear < moment(value)) {
                this.patientForm.controls.parentDocnum.enable();
                this.isParentDocument = false;
            } else {
                this.patientForm.controls.parentDocnum.disable();
                this.patientForm.controls.parentDocnum.setValue(false);
                this.isParentDocument = true;
            }
            this.api.MINIMUM_TIMESTAMP = new Date(value);
        });

    }

    showMoreInform() {
        this.patientAddInfo = !this.patientAddInfo;
    }

    trackByFn(index, item) {
        return item.id;
    }

    isValid(name: string) {
        return ValidationService.checkValidation(name, this.patientForm);
    }
}
