import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Self} from '@angular/core';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDatepicker, MatSelectChange} from '@angular/material';
import {debounceTime, map, skip, takeUntil} from 'rxjs/operators';
import {DictionaryService} from '../../../service/dictionary.service';
import {AbsenceReason, DoctorForConclusion, DoctorForExamination, HealthGroup, ReasonMissed} from '../../../models/dictionary.model';
import * as moment from 'moment';
import {NgOnDestroy} from '../../../@core/shared/services/destroy.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-card-conclusion',
    templateUrl: './card-conclusion.component.html',
    styleUrls: ['./card-conclusion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgOnDestroy]
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
    isCardDisabled!: boolean;
    private doctorsForConclusion: DoctorForConclusion[];
    private filteredDoctors: Observable<DoctorForConclusion[]>;
    canDisabledControls = ['missedReasons', 'absence', 'nonExecutionTextarea'];


    constructor(private  fb: FormBuilder,
                private cardThirteenYService: CardThirteenYService,
                private dictionaryService: DictionaryService,
                private cdRef: ChangeDetectorRef,
                @Self() private onDestroy$: NgOnDestroy) {
        // this.cardThirteenYService.activeTabCurrentValues
        //     .pipe(takeUntil(this.onDestroy$))
        //     .subscribe(data => this.formValues = data);
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
        this.initAbsenceReasons();
        this.initDoctorsForConclusion();
        this.getFilteredDoctors();
        this.checkChangeOfMedicalExamination();
        this.setDoctorsDateData();
        this.setHealthGroupData();
        this.checkBlockState();
        this.checkFormChanges();
    }

    checkIsFormValid() {
        this.conclusionForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.cardThirteenYService.setActiveTabValid(this.conclusionForm.valid));
    }

    checkBlockState() {
        this.cardThirteenYService.isBlocked
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(state => {
                if (state) {
                    this.disableGroup();
                }
            });
    }

    disableGroup() {
        this.conclusionForm.disable({emitEvent: false});
        this.isCardDisabled = true;
        this.cardThirteenYService.setSelectedTabCurrentValues(null);
        this.cdRef.detectChanges();
    }

    getInitValues() {
        this.cardThirteenYService.activeTabInitValues
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
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
                doctorId: new FormControl('', [Validators.required]),
                recommendation: new FormControl('', [Validators.required]),
                medicalExamination: new FormControl(''),
                missedReasons: new FormControl(''),
                absence: new FormControl({value: '', disabled: true}),
                nonExecutionTextarea: new FormControl({value: '', disabled: true}),
            })
        });
    }

    initDoctorExaminationsForm() {
        this.dictionaryService.getDoctorsForExamination().subscribe((doctors: DoctorForExamination[]) => {
            this.doctorsForExaminations = doctors;
            this.doctorsForExaminations.forEach((item: DoctorForExamination, i) => {
                const date = this.formValues.doctorExaminations[i] ? this.formValues.doctorExaminations[i].date : '';
                this.doctorExaminations.push(
                    this.fb.group({
                        date: [date, [Validators.required]],
                        id: [item.id, [Validators.required]],
                        name: [item.name, [Validators.required]]
                    })
                );
            });
            this.cdRef.detectChanges();
            this.cardThirteenYService.setSelectedTabCurrentValues(null);
            if (this.isCardDisabled) {
                this.disableGroup();
            }
        });
    }

    setFormInitValues(data) {
        if (data.conclusion) {
            this.healthGroupConditions(data.disability.disabilityType, data.healthStatusAfter.healthGood);
            this.conclusionForm.get('opinionForm').get('recommendation').setValue(data.conclusion.recommend, {emitEvent: false});
            if (data.conclusion.person) {
                this.conclusionForm.get('opinionForm').get('doctor').setValue(data.conclusion.person.surname + ' ' +
                    data.conclusion.person.name + ' ' + data.conclusion.person.lastname, {emitEvent: false});
                this.conclusionForm.get('opinionForm').get('doctorId').setValue(data.conclusion.person.id, {emitEvent: false});
            }
            this.conclusionForm.get('opinionForm').get('medicalExamination')
                .setValue(data.conclusion.dispanserizationFail, {emitEvent: false});
            if (!data.conclusion.dispanserizationFail) {
                this.canDisabledControls.forEach(item => {
                    this.conclusionForm.get('opinionForm').get(item).disable();
                });
            }
            this.conditionMedicalExaminationValue(data.conclusion.dispanserizationFail);
            if (data.conclusion.failReason) {
                this.conclusionForm.get('opinionForm').get('missedReasons').setValue(data.conclusion.failReason.id, {emitEvent: false});
                if (data.conclusion.failReason.id === 1) {
                    this.conclusionForm.get('opinionForm').get('absence').enable();
                }
                if (data.conclusion.failReason.id === 6) {
                    this.conclusionForm.get('opinionForm').get('nonExecutionTextarea').enable();
                }
            }
            if (data.conclusion.absenceReason) {
                this.conclusionForm.get('opinionForm').get('absence').setValue(data.conclusion.absenceReason.id, {emitEvent: false});
            }
            if (data.conclusion.failReasonOther) {
                this.conclusionForm.get('opinionForm').get('nonExecutionTextarea')
                    .setValue(data.conclusion.failReasonOther, {emitEvent: false});
            }
        }
    }

    initHealthGroup() {
        this.dictionaryService.getHealthGroups().subscribe((groups: HealthGroup[]) => {
            this.healthGroup = groups;
            this.healthGroupFiltered = groups;
            this.setFormInitValues(this.formValues);
        });
    }

    initMissedReasons() {
        this.dictionaryService.getMissedReasons().subscribe((reasons: ReasonMissed[]) => this.missedReasons = reasons);
    }

    initAbsenceReasons() {
        this.dictionaryService.getAbsenceReasons().subscribe((reasons: AbsenceReason[]) => this.absenceReasons = reasons);
    }

    initDoctorsForConclusion() {
        this.dictionaryService.getDoctorsForConslusion().subscribe((doctors: DoctorForConclusion[]) => {
            const doctorList = doctors.map(item => ({
                ...item,
                fullName: item.surname + ' ' + item.name + ' ' + item.lastname
            }));
            this.doctorsForConclusion = doctorList;
        });
    }

    getFilteredDoctors() {
        this.filteredDoctors = this.conclusionForm.get('opinionForm').get('doctor').valueChanges
            .pipe(
                debounceTime(300),
                map(doctor => doctor ? this.filterDoctors(doctor) : this.doctorsForConclusion.slice())
            );
    }

    filterDoctors(value): DoctorForConclusion[] {
        const filterValue = value.toLowerCase();
        return this.doctorsForConclusion.filter(state => state.fullName.toLowerCase().indexOf(filterValue) > -1);
    }

    setDoctorId(id: number) {
        this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').doctorId.setValue(id);
    }

    checkFormChanges() {
        this.conclusionForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => this.cardThirteenYService.setSelectedTabCurrentValues(data));
    }

    healthGroupConditions(disabilityType, healthGood) {
        if (disabilityType.id === 1) {
            this.conclusionForm.get('opinionForm').get('healthGroup').setValue(5, {emitEvent: false});
            this.healthGroupFiltered = this.healthGroup.filter(item => item.id === 5);
        } else {
            if (healthGood) {
                this.conclusionForm.get('opinionForm').get('healthGroup').setValue(1, {emitEvent: false});
            } else {
                this.conclusionForm.get('opinionForm').get('healthGroup').setValue(2, {emitEvent: false});
                this.healthGroupFiltered = this.healthGroup.filter(item => item.id !== 1);
            }
        }
        this.cdRef.detectChanges();
    }

    checkChangeOfMedicalExamination() {
        this.conclusionForm.get('opinionForm').get('medicalExamination').valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(checked => this.conditionMedicalExaminationValue(checked));
    }

    conditionMedicalExaminationValue(checked) {
        if (checked) {
            this.conclusionForm.get('opinionForm').get('missedReasons').enable();
        } else {
            this.canDisabledControls.forEach((control: string) => {
                this.conclusionForm.get('opinionForm').get(control).disable();
                this.conclusionForm.get('opinionForm').get(control).setValue('');
            });
        }
    }

    openDatepicker(name: MatDatepicker<any>) {
        name.open();
    }

    setDoctorsDateData() {
        this.conclusionForm.controls.doctorExaminations.valueChanges
            .pipe(
                skip(12),
                takeUntil(this.onDestroy$)
            )
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
        this.conclusionForm.controls.opinionForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(val => {
                const conclusionObj = {
                    ...this.formValues,
                    conclusion: {
                        healthGroup: {
                            id: val.healthGroup,
                        },
                        recommend: val.recommendation,
                        person: {
                            id: val.doctorId
                        },
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
            this.conclusionForm.get('opinionForm').get('absence').enable();
            this.conclusionForm.get('opinionForm').get('nonExecutionTextarea').setValue('');
            this.conclusionForm.get('opinionForm').get('nonExecutionTextarea').disable();
        } else if (event.source.value === 6) {
            this.conclusionForm.get('opinionForm').get('nonExecutionTextarea').enable();
            this.conclusionForm.get('opinionForm').get('absence').setValue('');
            this.conclusionForm.get('opinionForm').get('absence').disable();
        } else {
            this.conclusionForm.get('opinionForm').get('absence').setValue('');
            this.conclusionForm.get('opinionForm').get('absence').disable();
            this.conclusionForm.get('opinionForm').get('nonExecutionTextarea').setValue('');
            this.conclusionForm.get('opinionForm').get('nonExecutionTextarea').disable();
        }
    }
}
