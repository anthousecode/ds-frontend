import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDatepicker, MatSelectChange} from '@angular/material';
import {BirthdayValidator} from '../../../validators/date.validator';
import {debounceTime, skip} from 'rxjs/operators';
import {DictionaryService} from '../../../service/dictionary.service';
import {AbsenceReason, DoctorForConclusion, DoctorForExamination, HealthGroup, ReasonMissed} from '../../../models/dictionary.model';
import * as moment from 'moment';
import {pipe} from 'rxjs';

@Component({
    selector: 'app-card-conclusion',
    templateUrl: './card-conclusion.component.html',
    styleUrls: ['./card-conclusion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardConclusionComponent implements OnInit {

    // @ViewChild('datepickerOrthopedist') datepickerOrthopedist: MatDatepicker<any>;
    // @ViewChild('datepickerChildren') datepickerChildren: MatDatepicker<any>;
    // @ViewChild('datepickerDentist') datepickerDentist: MatDatepicker<any>;
    // @ViewChild('datepickerPediatrician') datepickerPediatrician: MatDatepicker<any>;
    // @ViewChild('datepickerOculist') datepickerOculist: MatDatepicker<any>;
    // @ViewChild('datepickerSurgeon') datepickerSurgeon: MatDatepicker<any>;
    // @ViewChild('datepickerDate') datepickerDate: MatDatepicker<any>;

    private conclusionForm: FormGroup;
    private healthGroup: HealthGroup[];
    private maxDate = new Date();
    private doctorsForExaminations: DoctorForExamination[] = [];
    private missedReasons: ReasonMissed[];
    private absenceReasons: AbsenceReason[];
    private formValues!: any;
    private doctorsList: DoctorForConclusion[];
    validatorsData: {};


    constructor(private  fb: FormBuilder,
                private cardThirteenYService: CardThirteenYService,
                private dictionaryService: DictionaryService,
                private cdRef: ChangeDetectorRef) {
        this.cardThirteenYService.activeTabCurrentValues
            .subscribe(data => {
                this.formValues = data;
            });

        // this.validatorsData = {
        //   birthday: AbstractControl,
        //   examDate: AbstractControl,
        // };
    }

    get doctorExaminations() {
        return this.conclusionForm.get('doctorExaminations') as FormArray;
    }

    ngOnInit() {
        this.createConclusionForm();
        this.getInitValues();
        this.initDoctorExaminationsForm();
        this.initHealthGroup();
        this.initMissedReasons();
        this.initDoctorsList();
        this.initAbsenceReasons();
        this.setDoctorsDateData();
        this.setHealthGroupData();
        // this.checkFormChanges();
    }

    getInitValues() {
        this.cardThirteenYService.activeTabInitValues
            .subscribe(data => {
                this.formValues = data;
                this.setFormInitValues(data);
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
                missedReasons: new FormControl({value: '', disabled: true}),
                absence: new FormControl({value: '', disabled: true}),
                nonExecutionTextarea: new FormControl({value: '', disabled: true}),
            })
        });
    }

    initDoctorExaminationsForm() {
        this.dictionaryService.getDoctorsForExamination().subscribe((doctors) => {
            this.doctorsForExaminations = doctors;
            // console.log('this.formValues', this.formValues);
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
        });
    }

    setFormInitValues(data) {
        console.log('data', data);
        if (data.conclusion) {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').healthGroup
                .setValue(data.conclusion.healthGroup.name, {emitEvent: false});
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').doctor
            // tslint:disable-next-line:max-line-length
                .setValue(`${data.conclusion.person.surname} + '' + ${data.conclusion.person.name} + '' + ${data.conclusion.person.lastname}`, {emitEvent: false});
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').recommendation
                .setValue(data.recommend, {emitEvent: false});
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').medicalExamination
                .setValue(data.dispanserizationFail, {emitEvent: false});
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').missedReasons
                .setValue(data.failReason.name, {emitEvent: false});
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence
                .setValue(data.absenceReason.name, {emitEvent: false});
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea
                .setValue(data.failReasonOther, {emitEvent: false});
        }

    }

    initHealthGroup() {
        this.dictionaryService.getHealthGroups().subscribe(item => this.healthGroup = item);
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

    // checkFormChanges() {
    //   this.conclusionForm.valueChanges
    //     .subscribe(data => this.cardThirteenYService.setTabCurrentValues(data));
    // }

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
                console.log(formArrayConclusion);
                const conclusionObject = {
                    ...this.formValues,
                    doctorExaminations: formArrayConclusion
                };
                this.cardThirteenYService.setTabCurrentValues(conclusionObject);
                console.log(this.formValues);
            });
    }

    setHealthGroupData() {
        this.conclusionForm.controls.opinionForm.valueChanges.subscribe(val => {
            console.log('val', val);
            const conclusionObj = {
                ...this.formValues,
                conclusion: {
                    healthGroup: {
                        id: val.healthGroup,
                    },
                    recommend: val.recommendation,
                    person: {
                        surname: val.surname,
                        name: val.name,
                        lastname: val.lastname,
                    },
                    date: this.getDoctorDateFormat(val.date),
                    dispanserizationFail: val.medicalExamination,
                    failReason: {
                        id: val.missedReasons
                    },
                    absenceReason: {
                        id: val.absence
                    },
                    failReasonOther: val.nonExecutionTextarea
                }
            };
            this.cardThirteenYService.setTabCurrentValues(conclusionObj);
            console.log(this.formValues);
        });
    }

    getDoctorDateFormat(date) {
        if (date) {
            return typeof date === 'string' ? date : date.format();
        } else {
            return '';
        }
    }

    isDisabledMedicalExamination(checked) {
        if (checked) {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').missedReasons.enable();
        } else {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').missedReasons.disable();
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').missedReasons.setValue('');
        }
    }

    isDisabledMissedReasons(event: MatSelectChange) {
        if (event.source.value === 1) {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.enable();
        } else {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.disable();
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.setValue('');
        }
        if (event.source.value === 6) {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.enable();
        } else {
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.disable();
            this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.setValue('');
        }
    }
}
