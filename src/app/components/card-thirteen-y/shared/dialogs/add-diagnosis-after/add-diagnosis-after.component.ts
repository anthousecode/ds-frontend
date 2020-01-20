import {Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef, Optional, Self} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {debounceTime, filter, takeUntil} from 'rxjs/operators';
import {DispensaryObservation, Mkb10, TreatmentCondition, TreatmentOrganizationType} from '../../../../../models/dictionary.model';
import {DictionaryService} from '../../../../../service/dictionary.service';
import {DISABLED_CONTROL_LIST, INIT_GROUPS} from './shared/disabled-controls';
import {NgOnDestroy} from '../../../../../@core/shared/services/destroy.service';

@Component({
    selector: 'app-add-diagnosis-after',
    templateUrl: './add-diagnosis-after.component.html',
    styleUrls: ['./add-diagnosis-after.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgOnDestroy]
})
export class AddDiagnosisAfterComponent implements OnInit {
    healthStatusAfter!: FormGroup;
    health!: FormGroup;
    dispensaryObservation!: DispensaryObservation[];
    diagnosisList!: Mkb10[];
    treatmentCondition!: TreatmentCondition[];
    treatmentOrganizationTypes!: TreatmentOrganizationType[];
    private formValues!: any;
    private localData: any;
    isSaveDisabled = true;
    isHealthGood!: boolean;
    treatmentConditionOrgVisible!: boolean;
    consulNeedOrgVisible!: boolean;
    consulDoneOrgVisible!: boolean;
    rehabilNeedOrgVisible!: boolean;
    initGroups = INIT_GROUPS;
    disabledControlList = DISABLED_CONTROL_LIST;

    constructor(private cardThirteenYService: CardThirteenYService,
                private fb: FormBuilder,
                private dictionaryService: DictionaryService,
                private cdRef: ChangeDetectorRef,
                private snackBar: MatSnackBar,
                private dialogRef: MatDialogRef<AddDiagnosisAfterComponent>,
                @Optional() @Inject(MAT_DIALOG_DATA) public diagnosisData: any,
                @Self() private onDestroy$: NgOnDestroy) {
    }

    ngOnInit() {
        this.initForm();
        this.getInitValues();
        this.getDiagnosisList();
        this.getTreatmentOrganizationTypes();
        this.getDispensaryObservations();
        this.getTreatmentCondition();
        this.checkFormChanges();
        this.checkFormValid();
        this.setHealthGroupData();
        this.changeMedOrganizationTypeVisibleState();
        this.changeAdditionalConsultationsAppointedVisibleState();
        this.changeAdditionalConsultationsDoneVisibleState();
        this.changeSklPrescribedMedTypeVisibleState();
        this.dataState();
        this.checkHealthGoodChanges();
    }

    dataState() {
        if (typeof this.diagnosisData !== 'boolean') {
            this.isHealthGood = this.diagnosisData.healthGood;
            Object.keys(this.diagnosisData.diagnoses).forEach(key => {
                if (!this.diagnosisData.diagnoses[key]) {
                    delete this.diagnosisData.diagnoses[key];
                }
            });
            this.healthStatusAfter.patchValue(this.diagnosisData, {emitEvent: false});
            this.disableControlsCondition(this.isHealthGood);
            if (!this.isHealthGood) {
                this.initGroups.forEach(item => this.checkVisibilityConditions(this.diagnosisData.diagnoses[item].id, item + 'Org'));
            }
            this.healthStatusAfter.get('healthGood').disable();
            this.localData = this.diagnosisData;
        } else {
            this.isHealthGood = this.diagnosisData;
            this.disableControlsCondition(this.isHealthGood);
            this.healthStatusAfter.get('healthGood').setValue(this.diagnosisData, {emitEvent: false});
        }
    }

    checkHealthGoodChanges() {
        this.healthStatusAfter.get('healthGood').valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                this.isHealthGood = data;
                this.disableControlsCondition(data);
            });
    }

    disableControlsCondition(value) {
        if (value) {
            this.disabledControlList.forEach(item => {
                this.healthStatusAfter.get('diagnoses').get(item).reset();
                this.healthStatusAfter.get('diagnoses').get(item).disable();
            });
        } else {
            this.disabledControlList.forEach(item => this.healthStatusAfter.get('diagnoses').get(item).enable());
        }
    }

    initForm() {
        this.healthStatusAfter = new FormGroup({
            healthGood: new FormControl(''),
            diagnoses: new FormGroup({
                id: new FormControl(''),
                dispensaryObservation: new FormGroup({
                    id: new FormControl('', [Validators.required]),
                    name: new FormControl('')
                }),
                diagnosisFirst: new FormControl(false),
                treatmentCondition: new FormGroup({
                    id: new FormControl('', Validators.required),
                    name: new FormControl('', Validators.required)
                }),
                treatmentConditionOrg: new FormGroup({
                    id: new FormControl('', Validators.required),
                    name: new FormControl('', Validators.required)
                }),
                consulNeed: new FormGroup({
                    id: new FormControl('', Validators.required),
                    name: new FormControl('', Validators.required)
                }),
                consulNeedOrg: new FormGroup({
                    id: new FormControl('', Validators.required),
                    name: new FormControl('', Validators.required)
                }),
                consulDone: new FormGroup({
                    id: new FormControl('', Validators.required),
                    name: new FormControl('', Validators.required)
                }),
                consulDoneOrg: new FormGroup({
                    id: new FormControl('', Validators.required),
                    name: new FormControl('', Validators.required)
                }),
                rehabilNeed: new FormGroup({
                    id: new FormControl('', Validators.required),
                    name: new FormControl('', Validators.required)
                }),
                rehabilNeedOrg: new FormGroup({
                    id: new FormControl('', Validators.required),
                    name: new FormControl('', Validators.required)
                }),
                needVmp: new FormControl(false),
                recommend: new FormControl('', Validators.required),
                mkb10: new FormGroup({
                    id: new FormControl(''),
                    name: new FormControl('', Validators.required),
                    code: new FormControl('')
                }),
            })
        });
    }

    checkFormValid() {
        this.healthStatusAfter.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.isSaveDisabled = !this.healthStatusAfter.valid);
    }

    getInitValues() {
        this.cardThirteenYService.activeTabInitValues
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(card => this.formValues = card);
    }

    getDispensaryObservations() {
        this.dictionaryService.getDispensaryObservations().subscribe(data => {
            this.dispensaryObservation = data;
            if (typeof this.diagnosisData === 'boolean' && !this.diagnosisData) {
                this.setNewDiagnosisInitValue('dispensaryObservation', 3, data);
            }
            this.cdRef.detectChanges();
        });
    }

    getTreatmentOrganizationTypes() {
        this.dictionaryService.getTreatmentOrganizationTypes().subscribe(data => {
            this.treatmentOrganizationTypes = data;
            this.cdRef.detectChanges();
        });
    }

    getTreatmentCondition() {
        this.dictionaryService.getTreatmentConditions().subscribe(data => {
            this.treatmentCondition = data;
            if (typeof this.diagnosisData === 'boolean' && !this.diagnosisData) {
                this.initGroups.forEach(item => this.setNewDiagnosisInitValue(item, 1, data));
            }
            this.cdRef.detectChanges();
        });
    }

    getDiagnosisList() {
        this.healthStatusAfter.get('diagnoses').get('mkb10').get('name').valueChanges
            .pipe(
                filter(value => value !== ''),
                debounceTime(500),
                filter(text => this.diagnosisList ? !this.diagnosisList.find(item => item.name === text) : true),
                takeUntil(this.onDestroy$)
            ).subscribe(data => {
            this.dictionaryService.getMkb10s(1, 50, data).subscribe((list: Mkb10[]) => {
                this.diagnosisList = list.filter(orgItem => {
                    return this.healthStatusAfter.get('healthGood').value ? orgItem.code === 'Z00' : orgItem.code !== 'Z00';
                });
                this.cdRef.detectChanges();
            });
        });
    }

    setControlId(object, groupName) {
        this.healthStatusAfter.get('diagnoses').get(groupName).patchValue(object);
    }

    setNewDiagnosisInitValue(groupName, value, data) {
        const obj = data.find(item => item.id === value);
        this.healthStatusAfter.get('diagnoses').get(groupName).patchValue(obj, {emitEvent: false});
    }

    checkFormChanges() {
        this.healthStatusAfter.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => this.cardThirteenYService.setSelectedTabCurrentValues(data));
    }

    changeMedOrganizationTypeVisibleState() {
        this.healthStatusAfter.get('diagnoses').get('treatmentCondition').get('id').valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((value: number) => this.checkVisibilityConditions(value, 'treatmentConditionOrg'));
    }

    changeAdditionalConsultationsAppointedVisibleState() {
        this.healthStatusAfter.get('diagnoses').get('consulNeed').get('id').valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((value: number) => this.checkVisibilityConditions(value, 'consulNeedOrg'));
    }

    changeAdditionalConsultationsDoneVisibleState() {
        this.healthStatusAfter.get('diagnoses').get('consulDone').get('id').valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((value: number) => this.checkVisibilityConditions(value, 'consulDoneOrg'));
    }

    changeSklPrescribedMedTypeVisibleState() {
        this.healthStatusAfter.get('diagnoses').get('rehabilNeed').get('id').valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((value: number) => this.checkVisibilityConditions(value, 'rehabilNeedOrg'));
    }

    checkVisibilityConditions(value: number, groupName: string) {
        if (value === 4) {
            this[groupName + 'Visible'] = false;
            this.healthStatusAfter.get('diagnoses').get(groupName).reset();
            this.healthStatusAfter.get('diagnoses').get(groupName).disable();
        } else {
            this[groupName + 'Visible'] = true;
            this.healthStatusAfter.get('diagnoses').get(groupName).enable();
        }
    }

    setHealthGroupData() {
        this.healthStatusAfter.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(val => {
                this.localData = val;
                this.cdRef.detectChanges();
            });
    }

    saveAndClose() {
        if (!this.localData.diagnoses.id) {
            delete this.localData.diagnoses.id;
        }
        this.dialogRef.close({data: this.localData});
        this.snackBar.open('Диагноз добавлен', 'ОК', {duration: 5000});
    }
}
