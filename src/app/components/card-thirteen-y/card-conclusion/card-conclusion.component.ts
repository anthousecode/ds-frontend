import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDatepicker, MatSelectChange} from '@angular/material';
import {skip} from 'rxjs/operators';
import {DictionaryService} from '../../../service/dictionary.service';
import {AbsenceReason, DoctorForConclusion, DoctorForExamination, HealthGroup, ReasonMissed} from '../../../models/dictionary.model';
import * as moment from 'moment';

@Component({
    selector: 'app-card-conclusion',
    templateUrl: './card-conclusion.component.html',
    styleUrls: ['./card-conclusion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardConclusionComponent implements OnInit {
    private conclusionForm: FormGroup;
    private healthGroup: HealthGroup[];
    private healthGroupFiltered: HealthGroup[];
    private maxDate = new Date();
    private doctorsForExaminations: DoctorForExamination[] = [];
    private missedReasons: ReasonMissed[];
    private absenceReasons: AbsenceReason[];
    private formValues!: any;
    private doctorsList: DoctorForConclusion[];
    canDisabledControls = ['missedReasons', 'absence', 'nonExecutionTextarea'];


    constructor(private  fb: FormBuilder,
                private cardThirteenYService: CardThirteenYService,
                private dictionaryService: DictionaryService,
                private cdRef: ChangeDetectorRef) {
        this.cardThirteenYService.activeTabCurrentValues.subscribe(data => this.formValues = data);
    }

    get doctorExaminations() {
        return this.conclusionForm.get('doctorExaminations') as FormArray;
    }

    ngOnInit() {
        this.createConclusionForm();
        this.getInitValues();
        this.checkIsFormValid();
        this.initDoctorExaminationsForm();
        this.initMissedReasons();
        this.initDoctorsList();
        this.initAbsenceReasons();
        this.checkChangeOfMedicalExamination();
        this.setDoctorsDateData();
        this.setHealthGroupData();
        this.checkFormChanges();
    }

    checkIsFormValid() {
        this.conclusionForm.valueChanges.subscribe(() => this.cardThirteenYService.setActiveTabValid(this.conclusionForm.valid));
    }

    getInitValues() {
        this.cardThirteenYService.activeTabInitValues.subscribe(data => {
            this.formValues = data;
            this.initHealthGroup();
        });
    }

    createConclusionForm() {
        this.conclusionForm = new FormGroup({
            doctorExaminations: new FormArray([]),
            opinionForm: new FormGroup({
                healthGroup: new FormControl('', [Validators.required]),
                date: new FormControl(moment().format(), [Validators.required]),
                doctor: new FormControl('', [Validators.required]),
                recommendation: new FormControl('', [Validators.required]),
                medicalExamination: new FormControl(''),
                missedReasons: new FormControl(''),
                absence: new FormControl({value: '', disabled: true}),
                nonExecutionTextarea: new FormControl({value: '', disabled: true}),
            })
        });
    }

    initDoctorExaminationsForm() {
        this.dictionaryService.getDoctorsForExamination().subscribe((doctors) => {
            this.doctorsForExaminations = doctors;
            this.doctorsForExaminations.forEach((item: DoctorForExamination, i) => {
                this.doctorExaminations.push(
                    this.fb.group({
                        date: [this.formValues.doctorExaminations[i].date || '', [Validators.required]],
                        id: [item.id, [Validators.required]],
                        name: [item.name, [Validators.required]]
                    })
                );
            });
            this.cdRef.detectChanges();
            this.cardThirteenYService.setSelectedTabCurrentValues(null);
        });
    }

    setFormInitValues(data) {
        console.log(data)
        if (data.conclusion) {
            if (data.disability.disabilityType.id === 1) {
                this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').healthGroup.setValue(5, {emitEvent: false});
                this.healthGroupFiltered = this.healthGroup.filter(item => item.id === 5);
            } else {

            }
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').recommendation
                .setValue(data.conclusion.recommend, {emitEvent: false});
            if (data.conclusion.person) {
                this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').doctor
                // tslint:disable-next-line:max-line-length
                    .setValue(`${data.conclusion.person.surname} + '' + ${data.conclusion.person.name} + '' + ${data.conclusion.person.lastname}`, {emitEvent: false});
            }
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').medicalExamination
                .setValue(data.conclusion.dispanserizationFail, {emitEvent: false});
            if (!data.conclusion.dispanserizationFail) {
                this.canDisabledControls.forEach(item => {
                    this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm')[item].disable();
                });
            }
            this.conditionMedicalExaminationValue(data.conclusion.dispanserizationFail);
            if (data.conclusion.failReason) {
                this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').missedReasons
                    .setValue(data.conclusion.failReason.id, {emitEvent: false});
                if (data.conclusion.failReason.id === 1) {
                    this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.enable();
                }
                if (data.conclusion.failReason.id === 6) {
                    this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.enable();
                }
            }
            if (data.conclusion.absenceReason) {
                this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence
                    .setValue(data.conclusion.absenceReason.id, {emitEvent: false});
            }
            if (data.conclusion.failReasonOther) {
                this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea
                    .setValue(data.conclusion.failReasonOther, {emitEvent: false});
            }
        }
    }

    initHealthGroup() {
        this.dictionaryService.getHealthGroups().subscribe(item => {
            this.healthGroup = item;
            this.healthGroupFiltered = item;
            this.setFormInitValues(this.formValues);
        });
    }

    initDoctorsList() {
        this.dictionaryService.getDoctorsForConslusion().subscribe(item => this.doctorsList = item);
    }

    initMissedReasons() {
        this.dictionaryService.getMissedReasons().subscribe(item => this.missedReasons = item);
    }

    initAbsenceReasons() {
        this.dictionaryService.getAbsenceReasons().subscribe(item => this.absenceReasons = item);
    }

    checkFormChanges() {
        this.conclusionForm.valueChanges.subscribe(data => this.cardThirteenYService.setSelectedTabCurrentValues(data));
    }

    checkChangeOfMedicalExamination() {
        this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').medicalExamination.valueChanges.subscribe(checked => {
            this.conditionMedicalExaminationValue(checked);
        });
    }

    conditionMedicalExaminationValue(checked) {
        if (checked) {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').missedReasons.enable();
        } else {
            this.canDisabledControls.forEach(item => {
                this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm')[item].disable();
                this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm')[item].setValue('');
            });
        }
    }

    openDatepicker(name: MatDatepicker<any>) {
        name.open();
    }

    setDoctorsDateData() {
        this.conclusionForm.controls.doctorExaminations.valueChanges
            .pipe(skip(12))
            .subscribe(data => {
                const formArrayConclusion = data.map(item => {
                    return {
                        date: this.getDoctorDateFormat(item.date),
                        doctor: {
                            id: item.id,
                            name: item.name,
                        }
                    };
                });
                const conclusionObject = {
                    ...this.formValues,
                    doctorExaminations: formArrayConclusion
                };
                this.cardThirteenYService.setTabCurrentValues(conclusionObject);
            });
    }

    setHealthGroupData() {
        this.conclusionForm.controls.opinionForm.valueChanges.subscribe(val => {
            const conclusionObj = {
                ...this.formValues,
                conclusion: {
                    healthGroup: {
                        id: val.healthGroup,
                    },
                    recommend: val.recommendation,
                    date: this.getDoctorDateFormat(val.date),
                    dispanserizationFail: val.medicalExamination,
                    failReason: {
                        id: !val.missedReasons ? '' : val.missedReasons
                    },
                    absenceReason: {
                        id: !val.absence ? '' : val.absence
                    },
                    failReasonOther: !val.nonExecutionTextarea ? '' : val.nonExecutionTextarea
                }
            };
            this.cardThirteenYService.setTabCurrentValues(conclusionObj);
        });
    }

    getDoctorDateFormat(date) {
        if (date) {
            return typeof date === 'string' ? date : date.format();
        } else {
            return '';
        }
    }

    isDisabledMissedReasons(event: MatSelectChange) {
        if (event.source.value === 1) {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.enable();
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.setValue('');
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.disable();
        } else if (event.source.value === 6) {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.enable();
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.setValue('');
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.disable();
        } else {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.setValue('');
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.disable();
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.setValue('');
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.disable();
        }
    }
}
