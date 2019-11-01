import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Patient, PatientDocumentsEntity, PatientSendAPI } from '../../models/patient.model';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {PatientDocumentModalComponent} from './patient-document-modal/patient-document-modal.component';
import {MockService} from '../../service/mock.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PatientService} from '../../service/patient.service';
import {PatientHistoryModalComponent} from './patient-history-modal/patient-history-modal.component';
import {PatientUnionModalComponent} from './patient-union-modal/patient-union-modal.component';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ValiedateSnilsRequired} from '../../validators/snils.validator';
import {ValidationService} from '../../service/validation.service';
import {DateValidator} from '../../validators/date.validator';
import {regexMapVal} from '../../directive/validation.directive';
import * as moment from 'moment';
import {ReasonNumber} from '../../dictionary/snilsReason';
import {DictionaryService} from '../../service/dictionary.service';
import {Sex} from '../../models/dictionary.model';
import { isPlatformBrowser } from '@angular/common';
import { catchError, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { merge, Subject } from 'rxjs';
import { PatientDeleteModalComponent } from './patient-delete-modal/patient-delete-modal.component';


@Component({
    selector: 'app-patient-card',
    templateUrl: './patient-card.component.html',
    styleUrls: ['./patient-card.component.sass']
})
export class PatientCardComponent implements OnInit, OnDestroy {
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
    serverErrors: string[] = null;
    isBrowser: boolean = isPlatformBrowser(this.platformId);
    isMobile: boolean;
    private destroy$: Subject<any> = new Subject();
    duplicate = false;
    duplicatePatients: Patient[];
    possibleDuplicate = false;
    possibleDuplicatePatients: Patient[];
    snils: string;
    patientDocuments: PatientDocumentsEntity[] = [];

    constructor(
        public dialog: MatDialog,
        private mock: MockService,
        private route: ActivatedRoute,
        private apiPatient: PatientService,
        private apiDictionary: DictionaryService,
        private fb: FormBuilder,
        private router: Router,
        @Inject('M') private M: any,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
    }

    openDocumentDialog(updateDoc: PatientDocumentsEntity) {
        this.dialogConfig.data = { documents: this.patientDocuments, updateDoc };
        const docDialogRef = this.dialog.open(PatientDocumentModalComponent, this.dialogConfig);
        delete this.dialogConfig.data;
        docDialogRef.afterClosed()
            .subscribe(value => {
                if (value && value.documents) {
                    this.patientDocuments = value.documents;
                }
            });
    }

    createPatientDoc() {
        this.openDocumentDialog(null);
    }

    updatePatientDoc(item: PatientDocumentsEntity) {
        this.openDocumentDialog(item);
    }

    openDeletePatient() {
        const dialogRef = this.dialog.open(PatientDeleteModalComponent, this.dialogConfig);
        dialogRef.afterClosed()
            .subscribe(isDelete => {
                if (isDelete) {
                    this.deletePatient();
                }
            });
    }

    openPatientUnion() {
        this.dialog.open(PatientUnionModalComponent, this.dialogConfig);
    }

    /**
     * Отдельный стиль для историй
     */
    openPatientHistory() {
        const dialogHistoryConfig = new MatDialogConfig();
        dialogHistoryConfig.width = this.isMobile ? '100%' : '55%';
        dialogHistoryConfig.height = this.isMobile ? '90%' : '70%';
        dialogHistoryConfig.maxWidth = this.isMobile ? '100vm' : '80vm';
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

        if (this.isBrowser) {
            this.isMobile = window.innerWidth <= 993;
        }

        this.dialogConfig.disableClose = false;
        this.dialogConfig.autoFocus = true;
        this.dialogConfig.hasBackdrop = true;
        this.dialogConfig.backdropClass = '';
        this.dialogConfig.width = this.isMobile ? '100%' : '55%';
        this.dialogConfig.maxWidth = this.isMobile ? '100vm' : '80vm';
        this.dialogConfig.maxHeight = this.isMobile ? '90%' : '70%';


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
                if (data && data.id === 3) {
                    this.patientForm.controls.withoutSnilsReasonOther.setValidators(Validators.required);
                    this.patientForm.controls.withoutSnilsReasonOther.updateValueAndValidity();
                } else {
                    this.patientForm.controls.withoutSnilsReasonOther.setValidators(null);
                    this.patientForm.controls.withoutSnilsReasonOther.updateValueAndValidity();
                }
            }
        );

        this.patientForm.controls.snils.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe( () => {
                if (this.loader) { return; }

                if (this.patientForm.controls.snils.valid) {
                    const params = new HttpParams().set('snils', this.patientForm.controls.snils.value);

                    this.snils = this.patientForm.controls.snils.value;

                    this.apiPatient.searchPatient$(params)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(result => {
                            this.duplicatePatients = Object.values(result.patients).filter(
                                patient => !this.PatientFullInformation || this.PatientFullInformation.unqId !== patient.unqId);
                            this.duplicate = this.duplicatePatients.length > 0;
                        });
                }

            });

        merge(
            this.patientForm.controls.firstName.valueChanges,
            this.patientForm.controls.lastName.valueChanges,
            this.patientForm.controls.birthdate.valueChanges,
            this.patientForm.controls.sex.valueChanges
        ).subscribe(
            () => {
                if (this.loader) { return; }

                if (
                    this.patientForm.controls.firstName.valid
                    && this.patientForm.controls.lastName.valid
                    && this.patientForm.controls.birthdate.valid
                    && this.patientForm.controls.sex.value !== null
                ) {
                    const params = new HttpParams()
                        .set('firstName', this.patientForm.controls.firstName.value)
                        .set('lastName', this.patientForm.controls.lastName.value)
                        .set('birthdate_from', moment(this.patientForm.controls.birthdate.value).format('YYYY-MM-DD'))
                        .set('birthdate_to', moment(this.patientForm.controls.birthdate.value).format('YYYY-MM-DD'))
                        .set('sex', this.patientForm.controls.sex.value.id)
                        .set('strict_names', 'true');

                    this.apiPatient.searchPatient$(params)
                        .pipe(takeUntil(this.destroy$))
                        .subscribe(result => {
                            this.possibleDuplicatePatients = Object.values(result.patients).filter(
                                patient => !this.PatientFullInformation || this.PatientFullInformation.unqId !== patient.unqId);
                            this.possibleDuplicate = this.possibleDuplicatePatients.length > 0;
                        });
                }
            }
        );

    }

    /**
     * Удаление из нашего массива документов
     * @param index нашего документа
     */
    deleteState(index: number) {
        if ((index > -1 && this.patientDocuments.length > 1) || !this.PatientFullInformation) {
            this.patientDocuments.splice(index, 1);
            this.M.toast({html: 'Документ удален'});
        }
    }

    /**
     * Получение данных нашего пациента если есть
     * После получение сразу получаем историю пациента
     * И мерджим наши документы
     * @param id Пациента
     */
    getPatenInfo(id: number) {
        this.loader = true;
        this.apiPatient.getPatient(id)
            .subscribe(
            (response) => {
                this.loader = false;
                this.PatientFullInformation = response;
                this.patientForm.patchValue(response);
                if (!response.snils) {
                    this.check = true;
                    this.patientForm.controls.snils.reset();
                    this.patientForm.controls.snils.clearValidators();
                    this.patientForm.controls.snils.updateValueAndValidity();
                    this.patientForm.controls.withoutSnilsReason.setValidators(Validators.required);
                    this.patientForm.controls.withoutSnilsReason.updateValueAndValidity();
                }
                this.patientDocuments = response.patientDocuments;
            }, () => this.router.navigate(['404']));
    }


    /**
     * Сохраняем пациента или делаем update
     */
    savePatientInfo() {
        this.loader = true;
        this.serverErrors = null;
        this.snilsControlsReset();
        this.patientForm.value.patientDocuments = this.patientDocuments;
        const sendData: PatientSendAPI = {patient: this.patientForm.value};
        if (this.PatientFullInformation) {
            this.apiPatient.updatePatient(sendData).subscribe(
                (patient) => {
                    this.PatientFullInformation = patient;
                    this.M.toast({html: 'Карта изменена'});
                    this.patientDocuments = patient.patientDocuments;
                    this.router.navigateByUrl(this.router.createUrlTree(['patient-card', patient.id]));
                    this.loader = false;

                }, error => {
                    this.loader = false;
                    this.serverErrors = this.getErrorMessage(error);
                    this.M.toast({html: 'Ошибка при сохранении карты'});
                }
            );
        } else {
            this.apiPatient.createPatient(sendData).subscribe(
                (patient) => {
                    this.loader = false;
                    this.patientDocuments = [];
                    this.M.toast({html: 'Карта создана'});
                    this.router.navigateByUrl(this.router.createUrlTree(['patient-card', patient.id]));
                }, error => {
                    this.loader = false;
                    this.serverErrors = this.getErrorMessage(error);
                    this.M.toast({html: 'Ошибка при сохранении карты'});
                }
            );
        }
    }

    snilsControlsReset() {
        if (this.check) {
            this.patientForm.controls.snils.reset();
            this.patientForm.controls.snils.clearValidators();
            this.patientForm.controls.snils.updateValueAndValidity();
        } else {
            this.patientForm.controls.withoutSnilsReason.reset();
            this.patientForm.controls.withoutSnilsReason.clearValidators();
            this.patientForm.controls.withoutSnilsReason.updateValueAndValidity();
        }
    }

    trackByFn(index, item) {
        return item.id;
    }

    isValid(name: string) {
        return ValidationService.checkValidation(name, this.patientForm);
    }

    getErrorMessage(error) {
        if (error.error.errors && error.error.errors.errors) {
            return error.error.errors.errors;
        } else {
            if (error.error.message) {
                return [error.error.message];
            } else {
                return error.error;
            }
        }
    }

    changeCheckStatus() {
        this.check = !this.check;
        if (this.check) {
            this.patientForm.controls.snils.reset();
            this.patientForm.controls.snils.clearValidators();
            this.patientForm.controls.snils.updateValueAndValidity();
            this.duplicate = false;
            this.duplicatePatients = null;
            this.patientForm.controls.withoutSnilsReason.setValidators(Validators.required);
            this.patientForm.controls.withoutSnilsReason.updateValueAndValidity();
        } else {
            this.patientForm.controls.withoutSnilsReason.clearValidators();
            this.patientForm.controls.withoutSnilsReason.updateValueAndValidity();
            this.patientForm.controls.snils.setValidators(ValiedateSnilsRequired);
            this.patientForm.controls.snils.setValue(this.snils);
            this.patientForm.controls.snils.updateValueAndValidity();
        }
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

    deletePatient() {
        this.loader = true;
        this.apiPatient.deletePatient(this.PatientFullInformation.id)
            .pipe(finalize(() => this.loader = false))
            .pipe(catchError(err => this.getErrorMessage(err)))
            .subscribe(() => {
                this.M.toast({html: 'Карта удалена'});
                this.router.navigate(['patient-card']);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
