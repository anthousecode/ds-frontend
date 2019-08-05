import {Component, OnInit} from '@angular/core';
import {Patient, PatientDocumentsEntity} from '../../models/patient.model';
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
import {InspectionModel} from '../../models/inspection.model';
import {InspectionService} from '../../service/inspection.service';


@Component({
    selector: 'app-patient-card',
    templateUrl: './patient-card.component.html',
    styleUrls: ['./patient-card.component.sass']
})
export class PatientCardComponent implements OnInit {

    dialogConfig = new MatDialogConfig();
    patientForm: FormGroup;
    patientHistory: any[];
    PatientFullInformation: Patient;

    ValiedateSnils = ValiedateSnilsRequired;
    lastYear = moment().subtract(1, 'years');

    displayedColumns: string[] = ['card', 'type_card', 'status', 'ageGroup'];
    inspections: InspectionModel[];

    isParentDocument = true;
    isPresentPatient = false;
    patientAddInfo = true;
    idPatient: number;

    loader = false;

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
        if ((index > -1 && this.apiPatient.state.length > 1) || !this.isPresentPatient) {
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
                this.statusParentDocControl(response);
                this.PatientFullInformation = response;
                this.isPresentPatient = true;
                this.patientForm.patchValue(response);
                this.apiPatient.state = this.apiPatient.state.concat(response.patientDocuments);
                this.idPatient = response.id;
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

    /**
     * Сохраняем пациента или делаем update
     */
    savePatientInfo() {
        this.loader = true;

        this.patientForm.value.identityDocuments = this.apiPatient.state;
        const sendData: Patient = this.patientForm.value;

        if (this.isPresentPatient) {
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
            check: [false],
            noSnilsReason: [null],
            antotherSnilsReason: [null]
        });

        this.patientForm.controls.check.valueChanges.subscribe(
            data => {
                if (data) {
                    this.patientForm.controls.snils.disable();
                } else {
                    this.patientForm.controls.snils.enable();
                }
            }
        );

        this.patientForm.controls.birthdate.valueChanges.subscribe(value => {
            if (moment() > moment(value) && this.lastYear < moment(value)) {
                this.patientForm.controls.parentDocnum.enable();
                this.isParentDocument = false;
            } else {
                this.patientForm.controls.parentDocnum.disable();
                this.patientForm.controls.parentDocnum.setValue(false);
                this.isParentDocument = true;
            }
            this.apiPatient.MINIMUM_TIMESTAMP = new Date(value);
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

    getInspectionCard(id) {
        this.inspectionApi.getInspection(id).subscribe(
            data => {
                this.inspections = data;
            }
        );
    }
}
