import {Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, ElementRef, Self} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {IDiagnose} from '../shared/interfaces/diagnoses.interface';
import {Observable} from 'rxjs';
import {MatDatepicker, MatDialog, MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material';
import {AddDiagnosisComponent} from '../shared/dialogs/add-diagnosis/add-diagnosis.component';
import {AddDiagnosisAfterComponent} from '../shared/dialogs/add-diagnosis-after/add-diagnosis-after.component';
import {debounceTime, map, startWith, takeUntil} from 'rxjs/operators';
import {DeleteConfirmComponent} from '../shared/dialogs/delete-confirm/delete-confirm.component';
import {DictionaryService} from '../../../service/dictionary.service';
import {HealthDisorder, HealthGroup, InvalidDisease, InvalidType, ReabilitationStatus} from '../../../models/dictionary.model';
import {ENTER} from '@angular/cdk/keycodes';
import {NgOnDestroy} from '../../../@core/shared/services/destroy.service';

@Component({
    selector: 'app-card-health-status',
    templateUrl: './card-health-status.component.html',
    styleUrls: ['./card-health-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgOnDestroy]
})
export class CardHealthStatusComponent implements OnInit {
    @ViewChild('datepickerFirstDate') datepickerFirstDate!: MatDatepicker<any>;
    @ViewChild('datepickerLastDate') datepickerLastDate!: MatDatepicker<any>;
    @ViewChild('rehabilitationDate') rehabilitationDate!: MatDatepicker<any>;
    @ViewChild('invalidDiseasesInput') invalidDiseasesInput: ElementRef<HTMLInputElement>;
    @ViewChild('disabilityDisordersInput') disabilityDisordersInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    @ViewChild('auto2') matAutocomplete2: MatAutocomplete;
    healthStatusForm!: FormGroup;
    healthStatusList$!: Observable<HealthGroup[]>;
    diagnosisListAfter!: any;
    disabilityTypeList$!: Observable<InvalidType[]>;
    doneList$!: Observable<ReabilitationStatus[]>;
    formValues!: any;
    isTableDisabled!: boolean;

    private filteredDiseases$: Observable<string[]>;
    invalidDiseasesQuery!: InvalidDisease[];
    invalidDiseasesChips: string[] = [];
    invalidDiseases: string[] = [];

    private filteredDisorders$: Observable<string[]>;
    disordersQuery!: HealthDisorder[];
    disabilityDisordersChips: string[] = [];
    disabilityDisorders: string[] = [];

    isChipsDisabled!: boolean;
    separatorKeysCodes: number[] = [ENTER];
    maxDate = new Date();
    disabilityDisabledControlList = [
        'disabilityFirstDate',
        'disabilityLastDate',
        'disabilityDiseases',
        'disabilityDisorders',
        'rehabilitationDate',
        'rehabilitationPerformance'
    ];

    constructor(private cardThirteenYService: CardThirteenYService,
                private dictionaryService: DictionaryService,
                private dialog: MatDialog,
                private cdRef: ChangeDetectorRef,
                @Self() private onDestroy$: NgOnDestroy) {
        this.cardThirteenYService.setActiveTabValid(true);
    }

    ngOnInit() {
        this.initFormGroups();
        this.getInitValues();
        this.checkIsFormValid();
        this.checkBlockState();
        this.cardThirteenYService.setSelectedTabCurrentValues(null);
        this.healthStatusList$ = this.dictionaryService.getHealthGroups();
        this.disabilityTypeList$ = this.dictionaryService.getInvalidTypes();
        this.doneList$ = this.dictionaryService.getReabilitationStatuses();
        this.diagnosisList = this.cardThirteenYService.getDiagnoses();
        this.diagnosisListAfter = this.cardThirteenYService.getDiagnosesAfter();
        this.disabilityTypeChange();
        this.disableRehabilitationPerformance();
        this.setDisabilityData();
        this.filterDiseases();
        this.filterDisorders();
        this.checkFormChanges();
        this.checkHealthGroupChanges();
    }

    checkFormChanges() {
        this.healthStatusForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => this.cardThirteenYService.setSelectedTabCurrentValues(data));
    }

    checkIsFormValid() {
        this.healthStatusForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.cardThirteenYService.setActiveTabValid(true));
    }

    checkBlockState() {
        this.cardThirteenYService.isBlocked
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(state => {
                if (state) {
                    this.healthStatusForm.disable({emitEvent: false});
                    this.cardThirteenYService.setSelectedTabCurrentValues(null);
                    this.isChipsDisabled = true;
                    this.isTableDisabled = true;
                    this.cdRef.detectChanges();
                }
            });
    }

    initFormGroups() {
        this.healthStatusForm = new FormGroup({
            beforeMedicalExamination: new FormGroup({
                healthGroup: new FormControl('', [Validators.required])
            }),
            diagnoses: new FormControl(''),
            disability: new FormGroup({
                disabilityType: new FormControl(1, [Validators.required]),
                disabilityFirstDate: new FormControl('', [Validators.required]),
                disabilityLastDate: new FormControl('', [Validators.required]),
                disabilityDiseases: new FormControl('', [Validators.required]),
                disabilityDisorders: new FormControl('', [Validators.required]),
                rehabilitationDate: new FormControl('', [Validators.required]),
                rehabilitationPerformance: new FormControl('', [Validators.required])
            })
        });
    }

    checkHealthGroupChanges() {
        this.cardThirteenYService.getControls(this.healthStatusForm, 'beforeMedicalExamination').healthGroup.valueChanges
            .subscribe(id => {
                this.setHealthGroup(id);
            });
    }

    setHealthGroup(id) {
        this.formValues = {
            ...this.formValues,
            healthStatusBefore: {
                ...this.formValues.healthStatusBefore,
                healthGroup: {
                    id
                }
            }
        };
    }

    getInitValues() {
        this.cardThirteenYService.activeTabInitValues
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                this.formValues = data;
                this.cdRef.detectChanges();
                this.getInvalidDiseases();
                this.getDisabilityDisorders();
                this.setFormInitValues(data);
                this.cardThirteenYService.setSelectedTabInitValues(this.healthStatusForm.value);
            });
    }

    setFormInitValues(data) {
        if (data.healthStatusBefore && data.healthStatusBefore.healthGroup) {
            this.setHealthGroup(data.healthStatusBefore.healthGroup.id);
            this.healthStatusForm.get('beforeMedicalExamination').get('healthGroup')
                .setValue(data.healthStatusBefore.healthGroup.id, {emitEvent: false});
        } else {
            this.setHealthGroup(1);
            this.healthStatusForm.get('beforeMedicalExamination').get('healthGroup').setValue(1, {emitEvent: false});
        }
        if (data.healthStatusBefore && data.healthStatusBefore.diagnoses) {
            this.healthStatusForm.get('diagnoses').setValue(data.healthStatusBefore.diagnoses, {emitEvent: false});
        }
        if (data.disability) {
            if (data.disability.disabilityType) {
                this.healthStatusForm.get('disability').get('disabilityType')
                    .setValue(data.disability.disabilityType.id, {emitEvent: false});
                if (data.disability.disabilityType.id === 1) {
                    this.disableDisabilityControls();
                }
            }
            if (data.disability.firstSetDate) {
                this.healthStatusForm.get('disability').get('disabilityFirstDate')
                    .setValue(data.disability.firstSetDate, {emitEvent: false});
            }
            if (data.disability.lastExamDate) {
                this.healthStatusForm.get('disability').get('disabilityLastDate')
                    .setValue(data.disability.lastExamDate, {emitEvent: false});
            }
            if (data.disability.iprDate) {
                this.healthStatusForm.get('disability').get('rehabilitationDate').setValue(data.disability.iprDate, {emitEvent: false});
            }
            if (data.disability.iprStatus) {
                this.healthStatusForm.get('disability').get('rehabilitationPerformance')
                    .setValue(data.disability.iprStatus.id, {emitEvent: false});
            }
        } else {
            this.disableDisabilityControls();
        }
    }

    setDisabilityData() {
        this.healthStatusForm.controls.disability.valueChanges
            .pipe(
                debounceTime(500),
                takeUntil(this.onDestroy$)
            )
            .subscribe(data => {
                const diseasesChipsArr = this.invalidDiseasesQuery.filter(item => this.invalidDiseasesChips.includes(item.name));
                const disordersChipsArr = this.disordersQuery.filter(item => this.disabilityDisordersChips.includes(item.name));
                const disabilityObj = {
                    ...this.formValues,
                    disability: {
                        disabilityType: {
                            id: data.disabilityType
                        },
                        firstSetDate: this.getDateFormat(data.disabilityFirstDate),
                        lastExamDate: this.getDateFormat(data.disabilityLastDate),
                        diseases: diseasesChipsArr,
                        healthDisorders: disordersChipsArr,
                        iprDate: this.getDateFormat(data.rehabilitationDate),
                        iprStatus: {
                            id: data.rehabilitationPerformance
                        }
                    }
                };
                this.cardThirteenYService.setTabCurrentValues(disabilityObj);
            });
    }

    getDateFormat(date) {
        if (date) {
            return typeof date === 'string' ? date : date.format();
        } else {
            return '';
        }
    }

    private _filterChips(value: string, chipsControl: string): string[] {
        const filterValue = value.toLowerCase();
        return this[chipsControl].filter(item => item.toLowerCase().indexOf(filterValue) === 0);
    }

    private filterDiseases() {
        this.filteredDiseases$ = this.healthStatusForm.get('disability').get('disabilityDiseases').valueChanges
            .pipe(
                debounceTime(300),
                startWith(null),
                map((vaccination: string | null) => vaccination ?
                    this._filterChips(vaccination, 'invalidDiseases').sort() :
                    this.invalidDiseases.slice()
                )
            );
    }

    getInvalidDiseases() {
        this.dictionaryService.getInvalidDiseases().subscribe((invalidDiseases: InvalidDisease[]) => {
                this.invalidDiseasesQuery = invalidDiseases;
                this.invalidDiseases = invalidDiseases.map(item => item.name);
                this.setInitDiseases();
                this.cdRef.markForCheck();
            }
        );
    }

    setInitDiseases() {
        if (this.formValues.disability && this.formValues.disability.diseases) {
            const initDiseases = this.formValues.disability.diseases.map(item => item.name);
            this.invalidDiseasesChips = initDiseases;
            this.invalidDiseases = this.invalidDiseases.filter(item => !initDiseases.includes(item));
            this.cdRef.markForCheck();
        }
    }

    addInvalidDiseasesChip(event: MatAutocompleteSelectedEvent) {
        this.invalidDiseasesChips.push(event.option.viewValue);
        this.invalidDiseases = this.invalidDiseases.filter((item) => item !== event.option.viewValue);
        this.invalidDiseasesInput.nativeElement.value = '';
        this.cdRef.detectChanges();
    }

    removeInvalidDiseasesChip(chip: string) {
        this.invalidDiseasesChips = this.invalidDiseasesChips.filter((item) => item !== chip);
        this.healthStatusForm.get('disability').get('disabilityFirstDate')
            .setValue(this.healthStatusForm.get('disability').get('disabilityFirstDate').value);
        this.invalidDiseases = this.invalidDiseases.concat([chip]);
        this.cdRef.detectChanges();
    }

    private filterDisorders() {
        this.filteredDisorders$ = this.healthStatusForm.get('disability').get('disabilityDisorders').valueChanges
            .pipe(
                debounceTime(300),
                startWith(null),
                map((vaccination: string | null) => vaccination ? this._filterChips(vaccination, 'disabilityDisorders').sort() :
                    this.disabilityDisorders.slice()
                )
            );
    }

    getDisabilityDisorders() {
        this.dictionaryService.getHealthDisorders().subscribe((disabilityDisorders: HealthDisorder[]) => {
            this.disordersQuery = disabilityDisorders;
            this.disabilityDisorders = disabilityDisorders.map(item => item.name);
            this.setInitDisorders();
            this.cdRef.markForCheck();
        });
    }

    setInitDisorders() {
        if (this.formValues.disability && this.formValues.disability.healthDisorders) {
            const initDisorders = this.formValues.disability.healthDisorders.map(item => item.name);
            this.disabilityDisordersChips = initDisorders;
            this.disabilityDisorders = this.disabilityDisorders.filter(item => !initDisorders.includes(item));
            this.cdRef.markForCheck();
        }
    }

    addDisabilityDisordersChip(event: MatAutocompleteSelectedEvent) {
        this.disabilityDisordersChips.push(event.option.viewValue);
        this.disabilityDisorders = this.disabilityDisorders.filter(item => item !== event.option.viewValue);
        this.disabilityDisordersInput.nativeElement.value = '';
        this.cdRef.detectChanges();
    }

    removeDisabilityDisordersChip(chip: string) {
        this.disabilityDisordersChips = this.disabilityDisordersChips.filter(item => item !== chip);
        this.healthStatusForm.get('disability').get('disabilityFirstDate')
            .setValue(this.healthStatusForm.get('disability').get('disabilityFirstDate').value);
        this.disabilityDisorders = this.disabilityDisorders.concat([chip]);
        this.cdRef.detectChanges();
    }

    checkDeleteClass(event) {
        return event.path.find(element => element.className === '__delete-diagnosis');
    }

    addDiagnosis() {
        this.dialog.open(AddDiagnosisComponent, {
            panelClass: '__add-diagnosis-before',
            data: {
                formValues: this.formValues,
                modalName: 'Добавить диагноз'
            }
        }).afterClosed().subscribe(() => {
            this.cardThirteenYService.setTabCurrentValues(this.formValues);
            this.healthStatusForm.get('diagnoses').setValue(this.formValues.healthStatusBefore.diagnoses);
            this.cdRef.detectChanges();
        });
    }

    editDiagnosis(i, event) {
        if (!this.checkDeleteClass(event)) {
            this.dialog.open(AddDiagnosisComponent, {
                panelClass: '__add-diagnosis-before',
                autoFocus: false,
                data: {
                    healthStatusBefore: this.formValues.healthStatusBefore,
                    i,
                    formValues: this.formValues,
                    modalName: 'Изменить диагноз'
                }
            }).afterClosed().subscribe(() => {
                this.cardThirteenYService.setTabCurrentValues(this.formValues);
                this.healthStatusForm.get('diagnoses').setValue(this.formValues.healthStatusBefore.diagnoses);
                this.cdRef.detectChanges();
            });
        }
    }

    addDiagnosisAfter() {
        const dialogRef = this.dialog.open(AddDiagnosisAfterComponent, {
            panelClass: '__add-diagnosis-after',
            data: this.formValues.healthStatusAfter.healthGood
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result)
            if (result) {
                const healthStatusAfterData = {
                    healthGood: result.data.healthGood,
                    diagnoses: this.formValues.healthStatusAfter.diagnoses.concat(result.data.diagnoses)
                };
                const healthStatusAfterObj = {
                    ...this.formValues,
                    healthStatusAfter: healthStatusAfterData
                };
                this.cardThirteenYService.setTabCurrentValues(healthStatusAfterObj);
                this.cdRef.detectChanges();
            }
        });
    }

    editDiagnosisAfter(diagnosis: IDiagnoses, event) {
        if (!this.checkDeleteClass(event)) {
            this.dialog.open(AddDiagnosisAfterComponent, {
                panelClass: '__add-diagnosis-after',
                data: diagnosisData
            }).afterClosed().subscribe(result => {
                if (result) {
                    console.log('result', result);
                    const afterObj = this.formValues.healthStatusAfter;
                    const diagnoses = afterObj.diagnoses;
                    diagnoses[i] = result.data.diagnoses;
                    const updatedAfterHealthStatusAfterObj = {
                        ...this.formValues,
                        healthStatusAfter: {
                            healthGood: afterObj.healthGood,
                            diagnoses
                        }
                    };
                    this.cardThirteenYService.setTabCurrentValues(updatedAfterHealthStatusAfterObj);
                    this.cdRef.detectChanges();
                }
            });
        }
    }

    disableDisabilityControls() {
        this.isChipsDisabled = true;
        this.disabilityDisabledControlList.forEach(control => {
            this.healthStatusForm.get('disability').get(control).disable();
            this.healthStatusForm.get('disability').get(control).setValue('');
            if (control === 'disabilityDisorders') {
                this.invalidDiseasesChips = [];
            }
            if (control === 'disabilityDiseases') {
                this.disabilityDisordersChips = [];
            }
        });
    }

    enableDisabilityControls() {
        this.isChipsDisabled = false;
        this.disabilityDisabledControlList.forEach(control => this.healthStatusForm.get('disability').get(control).enable());
        this.invalidDiseases = this.invalidDiseasesQuery.map(item => item.name);
        this.disabilityDisorders = this.disordersQuery.map(item => item.name);
    }

    deleteDiagnosis(i) {
        this.dialog.open(DeleteConfirmComponent, {
            panelClass: '__delete-confirm',
            data: {
                i,
                arr: this.formValues.healthStatusBefore.diagnoses,
            }
        }).afterClosed()
            .subscribe(() => {
                this.cardThirteenYService.setTabCurrentValues(this.formValues);
                this.healthStatusForm.get('diagnoses').setValue(this.formValues.healthStatusBefore.diagnoses);
                this.cdRef.detectChanges();
            });
    }

    deleteDiagnosisAfter(i) {
        this.dialog.open(DeleteConfirmComponent, {
            panelClass: '__delete-confirm',
            data: {
                i,
                arr: this.formValues.healthStatusAfter.diagnoses,
            }
        }).afterClosed().subscribe(result => {
            if (result) {
                const deletedDiagnose = {
                    ...this.formValues,
                    healthStatusAfter: {
                        healthGood: this.formValues.healthStatusAfter.healthGood,
                        diagnoses: result.data
                    }
                };
                this.cardThirteenYService.setTabCurrentValues(deletedDiagnose);
                this.cdRef.detectChanges();
            }
        });
    }

    openDatepicker(name: string) {
        this[name].open();
    }

    disabilityTypeChange() {
        this.healthStatusForm.get('disability').get('disabilityType').valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((type: number) => type === 1 ? this.disableDisabilityControls() : this.enableDisabilityControls());
    }

    disableRehabilitationPerformance() {
        this.healthStatusForm.get('disability').get('rehabilitationDate').valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                if (data) {
                    this.healthStatusForm.get('disability').get('rehabilitationPerformance').enable();
                } else {
                    this.healthStatusForm.get('disability').get('rehabilitationPerformance').disable();
                    this.healthStatusForm.get('disability').get('rehabilitationPerformance').setValue('');
                }
            });
    }
}
