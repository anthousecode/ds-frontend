import {Component, OnInit} from '@angular/core';
import {Patient, PatientDocumentsEntity} from '../../models/patient.model';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {PatientDocumentModalComponent} from './patient-document-modal/patient-document-modal.component';
import {MockService} from '../../service/mock.service';
import {ActivatedRoute} from '@angular/router';
import {PatientService} from '../../service/patient.service';
import {PatientHistoryModalComponent} from './patient-history-modal/patient-history-modal.component';
import {PatientUnionModalComponent} from './patient-union-modal/patient-union-modal.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as M from 'materialize-css/dist/js/materialize';
import {ValiedateSnilsRequired} from '../../validators/snils.validator';
import {ValidationService} from '../../service/validation.service';
import {DateValidator} from '../../validators/date.validator';
import {regexMapVal} from '../../directive/validation.directive';
import {InspectionModel} from '../../models/inspection.model';
import {InspectionService} from '../../service/inspection.service';
import * as moment from 'moment';
import {ReasonNumber, SnilsReasons} from '../../dictionary/snilsReason';


@Component({
    selector: 'app-patient-card',
    templateUrl: './patient-card.component.html',
    styleUrls: ['./patient-card.component.sass']
})
export class PatientCardComponent implements OnInit {
    formModel: { [key in keyof Patient]?: FormControl } = {
        id: new FormControl(null),
        sex: new FormControl(1),
        birthdate: new FormControl(null, [Validators.required, DateValidator]),
        firstName: new FormControl(null, [Validators.maxLength(50), Validators.required, Validators.pattern(regexMapVal.name)]),
        snils: new FormControl(null, [ValiedateSnilsRequired]),
        lastName: new FormControl(null, [Validators.maxLength(50), Validators.required, Validators.pattern(regexMapVal.name)]),
        patronymic: new FormControl(null, [Validators.pattern(regexMapVal.name), Validators.maxLength(50)]),
        withoutSnilsReason: new FormControl(null),
        withoutSnilsReasonOther: new FormControl(null),
        patientDocuments: new FormControl(null, Validators.required)
    };
    dialogConfig = new MatDialogConfig();
    patientForm: FormGroup = new FormGroup(this.formModel);
    PatientFullInformation: Patient;
    check = false;
    ValiedateSnils = ValiedateSnilsRequired;

    displayedColumns: string[] = ['card', 'type_card', 'status', 'ageGroup'];
    inspections: InspectionModel[];
    patientAddInfo = true;
    loader = false;

    reasons = SnilsReasons;

    constructor(public dialog: MatDialog,
                private mock: MockService,
                private route: ActivatedRoute,
                private apiPatient: PatientService,
                private fb: FormBuilder,
                private inspectionApi: InspectionService
    ) {
    }

    createPatientDoc() {
        this.dialog.open(PatientDocumentModalComponent, this.dialogConfig);
    }

    updatePatientDoc(item: PatientDocumentsEntity) {
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
        dialogHistoryConfig.data = this.patientForm.controls.id.value;
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
        this.dialogConfig.disableClose = false;
        this.dialogConfig.autoFocus = true;
        this.dialogConfig.hasBackdrop = true;
        this.dialogConfig.backdropClass = '';
        this.dialogConfig.width = '55%';
        this.dialogConfig.maxHeight = '70%';
        this.patientForm.controls.withoutSnilsReason.valueChanges.subscribe(
            data => {
                if (data === 3) {
                    this.patientForm.controls.withoutSnilsReasonOther.setValidators(Validators.required);
                    this.patientForm.controls.withoutSnilsReasonOther.updateValueAndValidity();
                }
            }
        );
    }

    /**
     * Удаление из нашего массива документов
     * @param index нашего документа
     */
    deleteState(index: number) {
        if ((index > -1 && this.apiPatient.state.length > 1) || !this.PatientFullInformation) {
            this.apiPatient.state.splice(index, 1);
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
        this.apiPatient.getPatient(id).subscribe(
            (response) => {
                this.getInspectionCard(response.id);
                this.PatientFullInformation = response;
                this.patientForm.patchValue(response);
                this.apiPatient.state = this.apiPatient.state.concat(response.patientDocuments);
            }
        );
    }


    /**
     * Сохраняем пациента или делаем update
     */
    savePatientInfo() {
        this.loader = true;

        this.patientForm.value.patientDocuments = this.apiPatient.state;
        const sendData: Patient = this.patientForm.value;

        if (this.PatientFullInformation) {
            this.apiPatient.updatePatient(sendData).subscribe(
                () => {
                    console.log('Uraa');
                    this.loader = false;

                }, error => {
                    console.log(error);
                    this.loader = false;

                }
            );
        } else {
            this.apiPatient.createPatient(sendData).subscribe(
                () => {
                    console.log('Save Data');
                    this.loader = false;
                }, error => {
                    console.log(error);
                    this.loader = false;
                }
            );
        }
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

    getInspectionCard(id) {
        this.inspectionApi.getInspection(id).subscribe(
            data => {
                this.inspections = data;
            }
        );
    }

    changeCheckStatus() {
        this.check = !this.check;
        this.patientForm.controls.snils.reset();
        this.patientForm.controls.snils.clearValidators();
        this.patientForm.controls.snils.updateValueAndValidity();
        this.patientForm.controls.withoutSnilsReason.reset();
        this.patientForm.controls.withoutSnilsReason.setValidators(Validators.required);
        this.patientForm.controls.withoutSnilsReason.updateValueAndValidity();
    }

    isRelativeDate(birthday, idReason) {
        if (idReason === ReasonNumber.NEW_BORN) {
            const lastYear = moment().subtract(1, 'years');
            return !(moment() > moment(birthday) && lastYear < moment(birthday));
        }
        return null;
    }
}
