import {Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, ElementRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {IDiagnoses} from '../shared/interfaces/diagnoses.interface';
import {Observable} from 'rxjs';
import {MatDatepicker, MatDialog, MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material';
import {AddDiagnosisComponent} from '../shared/dialogs/add-diagnosis/add-diagnosis.component';
import {AddDiagnosisAfterComponent} from '../shared/dialogs/add-diagnosis-after/add-diagnosis-after.component';
import {debounceTime} from 'rxjs/operators';
import {DeleteConfirmComponent} from '../shared/dialogs/delete-confirm/delete-confirm.component';
import {DictionaryService} from '../../../service/dictionary.service';
import {HealthGroup, InvalidType, ReabilitationStatus} from '../../../models/dictionary.model';
import {ENTER} from '@angular/cdk/keycodes';

@Component({
    selector: 'app-card-health-status',
    templateUrl: './card-health-status.component.html',
    styleUrls: ['./card-health-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardHealthStatusComponent implements OnInit {
    @ViewChild('datepickerFirstDate') datepickerFirstDate!: MatDatepicker<any>;
    @ViewChild('datepickerLastDate') datepickerLastDate!: MatDatepicker<any>;
    @ViewChild('rehabilitationDate') rehabilitationDate!: MatDatepicker<any>;
    healthStatusForm!: FormGroup;
    healthStatusList$!: Observable<HealthGroup[]>;
    diagnosisList!: Observable<IDiagnoses[]>;
    diagnosisListAfter!: Observable<IDiagnoses[]>;
    disabilityTypeList$!: Observable<InvalidType[]>;
    doneList$!: Observable<ReabilitationStatus[]>;
    isChipsDisabled!: boolean;
    maxDate = new Date();
    disabilityDisabledControlList = [
        'disabilityFirstDate',
        'disabilityLastDate',
        'disabilityDiseases',
        'disabilityDisorders',
        'rehabilitationDate'
    ];

    separatorKeysCodes: number[] = [ENTER];
    invalidDiseasesChips = [];
    disabilityDisordersChips = [];
    invalidDiseases = [];
    disabilityDisorders = [];

    @ViewChild('invalidDiseasesInput') invalidDiseasesInput: ElementRef<HTMLInputElement>;
    @ViewChild('disabilityDisordersInput') disabilityDisordersInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    @ViewChild('auto2') matAutocomplete2: MatAutocomplete;
    formValues!: any;

    constructor(private cardThirteenYService: CardThirteenYService,
                private dictionaryService: DictionaryService,
                private dialog: MatDialog,
                private cdRef: ChangeDetectorRef) {
        this.cardThirteenYService.activeTabCurrentValues
            .subscribe(data => {
                this.formValues = data;
            });
        this.cardThirteenYService.setActiveTabValid(true);
    }

    ngOnInit() {
        this.initFormGroups();
        this.getInitValues();
        this.checkIsFormValid();
        this.cardThirteenYService.setSelectedTabCurrentValues(null);
        this.healthStatusList$ = this.dictionaryService.getHealthGroups();
        this.disabilityTypeList$ = this.dictionaryService.getInvalidTypes();
        this.doneList$ = this.dictionaryService.getReabilitationStatuses();
        this.diagnosisList = this.cardThirteenYService.getDiagnoses();
        this.diagnosisListAfter = this.cardThirteenYService.getDiagnosesAfter();
        this.disabilityTypeChange();
        this.disableRehabilitationPerformance();
        this.setDisabilityData();

        this.checkFormChanges();
    }

    checkFormChanges() {
        this.healthStatusForm.valueChanges.subscribe(data => {
            this.cardThirteenYService.setSelectedTabCurrentValues(data);
        });
    }

    checkIsFormValid() {
        this.healthStatusForm.valueChanges.subscribe(() => {
            this.cardThirteenYService.setActiveTabValid(true);
        });
    }

    initFormGroups() {
        this.healthStatusForm = new FormGroup({
            beforeMedicalExamination: new FormGroup({
                healthGroup: new FormControl(1, [Validators.required])
            }),
            disability: new FormGroup({
                disabilityType: new FormControl(1, [Validators.required]),
                disabilityFirstDate: new FormControl({value: ''}, [Validators.required]),
                disabilityLastDate: new FormControl({value: ''}, [Validators.required]),
                disabilityDiseases: new FormControl({value: ''}, [Validators.required]),
                disabilityDisorders: new FormControl({value: ''}, [Validators.required]),
                rehabilitationDate: new FormControl({value: ''}, [Validators.required]),
                rehabilitationPerformance: new FormControl({value: ''}, [Validators.required])
            })
        });
    }

    getInitValues() {
        this.cardThirteenYService.activeTabInitValues
            .subscribe(data => {
                this.formValues = data;
                console.log(data);
                this.setFormInitValues(data);
                this.cardThirteenYService.setSelectedTabInitValues(this.healthStatusForm.value);
            });
    }

    setFormInitValues(data) {
        if (data.disability) {
            if (data.disability.disabilityType) {
                this.cardThirteenYService.getControls(this.healthStatusForm, 'disability').disabilityType
                    .setValue(data.disability.disabilityType.id);
                data.disability.disabilityType.id === 1 ? this.disableDisabilityControls() : this.enableDisabilityControls();
            }
            if (data.disability.firstSetDate) {
                this.cardThirteenYService.getControls(this.healthStatusForm, 'disability').disabilityFirstDate
                    .setValue(data.disability.firstSetDate);
            }
            if (data.disability.lastExamDate) {
                this.cardThirteenYService.getControls(this.healthStatusForm, 'disability').disabilityLastDate
                    .setValue(data.disability.lastExamDate);
            }
        }
    }

    setDisabilityData() {
        this.healthStatusForm.controls.disability.valueChanges.subscribe(data => {
            console.log(data)
            const disabilityObj = {
                ...this.formValues,
                disability: {
                    disabilityType: {
                        id: data.disabilityType
                    },
                    firstSetDate: this.getDateFormat(data.disabilityFirstDate),
                    lastExamDate: this.getDateFormat(data.disabilityLastDate),
                }
            };
            // console.log(disabilityObj)
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

    getInvalidDiseases() {
        this.dictionaryService.getInvalidDiseases()
            .subscribe(invalidDiseases => {
                    this.invalidDiseases = [];
                    for (const invalidDisease of invalidDiseases) {
                        const index = this.invalidDiseasesChips.indexOf(invalidDisease.name);
                        if (index === -1) {
                            this.invalidDiseases.push(invalidDisease.name);
                        }
                    }
                    this.cdRef.detectChanges();
                }
            );
    }

    getDisabilityDisorders() {
        this.dictionaryService.getHealthDisorders()
            .subscribe(disabilityDisorders => {
                this.disabilityDisorders = [];
                for (const disabilityDisorder of disabilityDisorders) {
                    const index = this.disabilityDisordersChips.indexOf(disabilityDisorder.name);
                    if (index === -1) {
                        this.disabilityDisorders.push(disabilityDisorder.name);
                    }
                }

                this.cdRef.detectChanges();
            });
    }

    addInvalidDiseasesChip(event: MatAutocompleteSelectedEvent) {
        this.invalidDiseasesChips.push(event.option.viewValue);
        const index = this.invalidDiseases.indexOf(event.option.viewValue);
        if (index >= 0) {
            this.invalidDiseases.splice(index, 1);
        }
        this.invalidDiseasesInput.nativeElement.blur();
        this.cdRef.detectChanges();
    }

    removeInvalidDiseasesChip(chip: string) {
        const index = this.invalidDiseasesChips.indexOf(chip);
        this.invalidDiseasesChips.splice(index, 1);
        this.invalidDiseases.push(chip);
        this.invalidDiseasesInput.nativeElement.blur();
        this.cdRef.detectChanges();
    }

    addDisabilityDisordersChip(event: MatAutocompleteSelectedEvent) {
        this.disabilityDisordersChips.push(event.option.viewValue);
        const index = this.disabilityDisorders.indexOf(event.option.viewValue);

        if (index >= 0) {
            this.disabilityDisorders.splice(index, 1);
        }

        this.disabilityDisordersInput.nativeElement.blur();
        this.cdRef.detectChanges();
    }

    removeDisabilityDisordersChip(chip: string) {
        const index = this.disabilityDisordersChips.indexOf(chip);
        this.disabilityDisordersChips.splice(index, 1);
        this.disabilityDisorders.push(chip);
        this.invalidDiseasesInput.nativeElement.blur();
        this.cdRef.detectChanges();
    }

    checkDeleteClass(event) {
        return event.path.find(element => {
            return element.className === '__delete-diagnosis';
        });
    }

    addDiagnosis() {
        this.dialog.open(AddDiagnosisComponent, {panelClass: '__add-diagnosis-before'});
    }

    editDiagnosis(diagnosis: IDiagnoses, event) {
        if (!this.checkDeleteClass(event)) {
            this.dialog.open(AddDiagnosisComponent, {
                panelClass: '__add-diagnosis-before',
                data: diagnosis
            });
        }
    }

    addDiagnosisAfter() {
        this.dialog.open(AddDiagnosisAfterComponent, {panelClass: '__add-diagnosis-after'});
    }

    editDiagnosisAfter(diagnosis: IDiagnoses, event) {
        if (!this.checkDeleteClass(event)) {
            this.dialog.open(AddDiagnosisAfterComponent, {
                panelClass: '__add-diagnosis-after',
                data: diagnosis
            });
        }
    }

    disableDisabilityControls() {
        this.isChipsDisabled = true;
        this.disabilityDisabledControlList.forEach((item) => {
            this.cardThirteenYService.getControls(this.healthStatusForm, 'disability')[item].disable();
            this.cardThirteenYService.getControls(this.healthStatusForm, 'disability')[item].setValue('');
            if (item === 'disabilityDisorders') {
                this.invalidDiseasesChips = [];
            }
            if (item === 'disabilityDiseases') {
                this.disabilityDisordersChips = [];
            }
        });
    }

    enableDisabilityControls() {
        this.isChipsDisabled = false;
        this.disabilityDisabledControlList.forEach((item) => {
            this.cardThirteenYService.getControls(this.healthStatusForm, 'disability')[item].enable();
        });
        this.getInvalidDiseases();
        this.getDisabilityDisorders();
    }

    deleteDiagnosis() {
        this.dialog.open(DeleteConfirmComponent, {panelClass: '__delete-confirm'});
    }

    openDatepicker(name: string) {
        this[name].open();
    }

    disabilityTypeChange() {
        this.cardThirteenYService.getControls(this.healthStatusForm, 'disability').disabilityType.valueChanges
            .subscribe((type: number) => {
                type === 1 ? this.disableDisabilityControls() : this.enableDisabilityControls();
            });
    }

    disableRehabilitationPerformance() {
        this.cardThirteenYService.getControls(this.healthStatusForm, 'disability').rehabilitationDate.valueChanges
            .subscribe(data => {
                if (data) {
                    this.cardThirteenYService.getControls(this.healthStatusForm, 'disability').rehabilitationPerformance.enable();
                } else {
                    this.cardThirteenYService.getControls(this.healthStatusForm, 'disability').rehabilitationPerformance.disable();
                    this.cardThirteenYService.getControls(this.healthStatusForm, 'disability').rehabilitationPerformance.setValue('');
                }
            });
    }
}
