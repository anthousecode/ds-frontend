import {Component, OnInit} from '@angular/core';
import {Patient, PatientDocumentsEntity, PatientSendAPI} from '../../models/patient.model';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {PatientDocumentModalComponent} from './patient-document-modal/patient-document-modal.component';
import {MockService} from '../../service/mock.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PatientService} from '../../service/patient.service';
import {PatientHistoryModalComponent} from './patient-history-modal/patient-history-modal.component';
import {PatientUnionModalComponent} from './patient-union-modal/patient-union-modal.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as M from '@samuelberthe/angular2-materialize';
import {ValiedateSnilsRequired} from '../../validators/snils.validator';
import {ValidationService} from '../../service/validation.service';
import {DateValidator} from '../../validators/date.validator';
import {regexMapVal} from '../../directive/validation.directive';
import * as moment from 'moment';
import {ReasonNumber} from '../../dictionary/snilsReason';
import {DictionaryService} from '../../service/dictionary.service';
import {Sex} from '../../models/dictionary.model';


@Component({
    selector: 'app-patient-card',
    templateUrl: './patient-card.component.html',
    styleUrls: ['./patient-card.component.sass']
})
export class PatientCardComponent implements OnInit {
    formModel: { [key in keyof Patient]?: FormControl };
    dialogConfig = new MatDialogConfig();
    patientForm: FormGroup;
    PatientFullInformation: Patient;
    check = false;
    ValiedateSnils = ValiedateSnilsRequired;
    displayedColumns: string[] = ['card', 'type_card', 'status', 'ageGroup'];
    patientAddInfo = true;
    loader = false;
    reasons$ = this.apiDictionary.getWithoutSnilsReasonType();
    sexes: Sex[] = this.apiDictionary.getSexes();
    noSnilsEnable = true;
    minDate = moment('1900-01-01').unix();

    constructor(public dialog: MatDialog,
                private mock: MockService,
                private route: ActivatedRoute,
                private apiPatient: PatientService,
                private apiDictionary: DictionaryService,
                private fb: FormBuilder,
                private router: Router
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
        this.initForm();
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


    }

    initForm() {
        this.formModel = {
            id: new FormControl(null),
            sex: new FormControl(this.sexes[0]),
            birthdate: new FormControl(null, {validators: [Validators.required, DateValidator], updateOn: 'blur'}),
            firstName: new FormControl(null, [Validators.maxLength(50), Validators.required, Validators.pattern(regexMapVal.name)]),
            snils: new FormControl(null, [ValiedateSnilsRequired]),
            lastName: new FormControl(null, [Validators.maxLength(50), Validators.required, Validators.pattern(regexMapVal.name)]),
            patronymic: new FormControl(null, [Validators.pattern(regexMapVal.name), Validators.maxLength(50)]),
            withoutSnilsReason: new FormControl(null),
            withoutSnilsReasonOther: new FormControl(null),
            patientDocuments: new FormControl(null)
        };
        this.patientForm = new FormGroup(this.formModel);
        this.patientForm.controls.birthdate.valueChanges.subscribe(
            data => {
                if (data !== null && data.unix() > this.minDate) {
                    const snilsMandatory = this.isSnilsMandatory(data);
                    const isNewborn = !this.isRelativeDate(data, ReasonNumber.NEW_BORN);
                    if (snilsMandatory) {
                        this.check = false;
                        this.noSnilsEnable = false;
                        this.changeValidationToSnils();
                    } else {
                        if (!isNewborn && this.isReasonSelected(ReasonNumber.NEW_BORN)) {
                            this.patientForm.controls.withoutSnilsReason.reset();
                        }
                    }
                    this.noSnilsEnable = !snilsMandatory;
                }
            }
        );
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
                this.PatientFullInformation = response;
                this.patientForm.patchValue(response);
                if (!response.snils) {
                    this.check = true;
                    this.patientForm.controls.snils.reset();
                    this.patientForm.controls.snils.clearValidators();
                    this.patientForm.controls.snils.updateValueAndValidity();
                }
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
        const sendData: PatientSendAPI = {patient: this.patientForm.value};
        if (this.PatientFullInformation) {
            this.apiPatient.updatePatient(sendData).subscribe(
                (patient) => {
                    this.router.navigateByUrl(this.router.createUrlTree(['patient-card', patient.id]));
                    this.loader = false;

                }, error => {
                    console.log(error);
                    this.loader = false;

                }
            );
        } else {
            this.apiPatient.createPatient(sendData).subscribe(
                (patient) => {
                    this.loader = false;
                    this.apiPatient.state = [];
                    this.router.navigateByUrl(this.router.createUrlTree(['patient-card', patient.id]));
                }, error => {
                    console.log(error);
                    this.loader = false;
                }
            );
        }
    }

    trackByFn(index, item) {
        return item.id;
    }

    isValid(name: string) {
        return ValidationService.checkValidation(name, this.patientForm);
    }

    changeCheckStatus() {
        this.check = !this.check;
        this.patientForm.controls.snils.reset();
        this.patientForm.controls.snils.clearValidators();
        this.patientForm.controls.snils.updateValueAndValidity();
    }

    changeValidationToSnils() {
        this.patientForm.controls.withoutSnilsReason.reset();
        this.patientForm.controls.withoutSnilsReason.clearValidators();
        this.patientForm.controls.withoutSnilsReason.updateValueAndValidity();
        this.patientForm.controls.snils.setValidators(ValiedateSnilsRequired);
        this.patientForm.controls.snils.updateValueAndValidity();
    }

    isRelativeDate(birthday, idReason) {
        if (idReason === ReasonNumber.NEW_BORN) {
            const lastYear = moment().subtract(1, 'years');
            return !(moment() > moment(birthday) && lastYear < moment(birthday));
        }
        return null;
    }

    isSnilsMandatory(birthday) {
        return moment().diff(moment(birthday, 'YYYYMMDD').subtract(14, 'days'), 'years') >= 14;
    }

    isReasonSelected(selectedReason: number): boolean {
        const reason = this.patientForm.controls.withoutSnilsReason.value;
        return reason !== null && reason.id === selectedReason;
    }

    compareFn(c1, c2): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }
}
