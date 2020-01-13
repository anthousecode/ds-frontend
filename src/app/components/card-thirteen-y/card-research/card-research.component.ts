import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Self} from '@angular/core';
import {FormGroup, Validators, FormBuilder, FormArray} from '@angular/forms';
import {MatDatepicker, MatDialog} from '@angular/material';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {AddStudyComponent} from '../shared/dialogs/add-study/add-study.component';
import {DeleteConfirmComponent} from '../shared/dialogs/delete-confirm/delete-confirm.component';
import {Examination} from '../../../models/dictionary.model';
import {DictionaryService} from '../../../service/dictionary.service';
import {NgOnDestroy} from '../../../@core/shared/services/destroy.service';
import {debounceTime, takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-card-research',
    templateUrl: './card-research.component.html',
    styleUrls: ['./card-research.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgOnDestroy]
})
export class CardResearchComponent implements OnInit {
    researchFormGroup!: FormGroup;
    requiredExaminations: Examination[];
    maxDate = new Date();
    additionalExaminations: [];
    formValues!: any;
    isCardDisabled!: boolean;
    isTableDisabled!: boolean;

    constructor(private cdRef: ChangeDetectorRef,
                private dialog: MatDialog,
                public cardThirteenYService: CardThirteenYService,
                private formBuilder: FormBuilder,
                private dictionaryService: DictionaryService,
                @Self() private onDestroy$: NgOnDestroy) {
        this.researchFormGroup = this.formBuilder.group({
            requiredExaminationsArray: this.formBuilder.array([]),
        });
        this.cardThirteenYService.setActiveTabValid(true);
    }

    ngOnInit() {
        this.requiredExaminations = [];
        this.getInitValues();
        this.setAdditionalExaminations();
        this.checkIsFormValid();
        this.checkBlockState();
        this.checkFormChanges();
    }

    get requiredExaminationsArray() {
        return this.researchFormGroup.get('requiredExaminationsArray') as FormArray;
    }

    getInitValues() {
        this.cardThirteenYService.activeTabInitValues
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                this.formValues = data;
                this.createResearchFormGroups();
                this.cardThirteenYService.setSelectedTabInitValues(this.researchFormGroup.value);
            });
    }

    checkFormChanges() {
        this.researchFormGroup.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => this.cardThirteenYService.setSelectedTabCurrentValues(data));
    }

    checkIsFormValid() {
        this.researchFormGroup.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.cardThirteenYService.setActiveTabValid(this.researchFormGroup.valid));
    }

    checkBlockState() {
        this.cardThirteenYService.isBlocked.subscribe(state => {
            if (state) {
                this.disableGroup();
            }
        });
    }

    disableGroup() {
        this.researchFormGroup.disable({emitEvent: false});
        this.cardThirteenYService.setSelectedTabCurrentValues(null);
        this.isCardDisabled = true;
        this.isTableDisabled = true;
        this.cdRef.detectChanges();
    }

    createResearchFormGroups() {
        this.dictionaryService.getExaminations(1, 100, '').subscribe(res => {
            this.requiredExaminations = [];
            res.forEach((examination, i) => {
                this.requiredExaminationsArray.push(
                    this.formBuilder.group({
                        dateBegin: [this.formValues.requiredExaminations[i].date || '', [Validators.required]],
                        result: [this.formValues.requiredExaminations[i].result || '', [Validators.required]]
                    })
                );
                this.requiredExaminations.push(examination);
            });
            this.setRequiredExaminations();
            this.cdRef.markForCheck();
            this.cardThirteenYService.setSelectedTabCurrentValues(null);
            if (this.isCardDisabled) {
                this.disableGroup();
            }
        });
    }

    setRequiredExaminations() {
        for (let i = 0; i < this.requiredExaminationsArray.length; i++) {
            this.requiredExaminationsArray.get(`${i}`).get('dateBegin').valueChanges.subscribe(date => {
                date = typeof date === 'string' ? date : date.format();
                this.formValues.requiredExaminations[i] = {
                    ...this.formValues.requiredExaminations[i],
                    exam: this.requiredExaminations[i],
                    date,
                };
                this.cardThirteenYService.setTabCurrentValues(this.formValues);
            });
            this.requiredExaminationsArray.get(`${i}`).get('result').valueChanges.subscribe(result => {
                this.formValues.requiredExaminations[i] = {
                    ...this.formValues.requiredExaminations[i],
                    exam: this.requiredExaminations[i],
                    result
                };
                this.cardThirteenYService.setTabCurrentValues(this.formValues);
            });
        }
    }

    setAdditionalExaminations() {
        this.additionalExaminations = this.formValues.additionalExaminations;
        this.cdRef.detectChanges();
    }

    addStudy() {
        this.dialog.open(AddStudyComponent, {
            panelClass: '__add-diagnosis-before',
            autoFocus: false,
            data: {
                formValues: this.formValues,
                additionalExaminations: this.additionalExaminations,
                cdRef: this.cdRef
            }
        });
    }

    deleteStudy(index: number) {
        this.dialog.open(DeleteConfirmComponent, {
            panelClass: '__delete-confirm',
            data: {
                formValues: this.formValues,
                additionalExaminations: this.additionalExaminations,
                index,
                key: 'research',
                cdRef: this.cdRef
            }
        });
    }

    editStudy(exam, index: number, event: MouseEvent) {
        if (!this.checkDeleteClass(event)) {
            this.dialog.open(AddStudyComponent, {
                panelClass: '__add-diagnosis-before',
                autoFocus: false,
                data: {
                    formValues: this.formValues,
                    additionalExaminations: this.additionalExaminations,
                    cdRef: this.cdRef,
                    mode: 'edit',
                    exam,
                    index
                }
            });
        }
    }

    checkDeleteClass(event) {
        return event.path.find(element => element.className === '__delete-diagnosis');
    }

    openDatepicker(name: MatDatepicker<any>) {
        name.open();
    }
}
