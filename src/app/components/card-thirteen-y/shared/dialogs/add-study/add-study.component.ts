import {Component, OnInit, ChangeDetectionStrategy, ViewChild, Inject, ChangeDetectorRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDatepicker, MatSnackBar} from '@angular/material';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import * as moment from 'moment';

@Component({
    selector: 'app-add-study',
    templateUrl: './add-study.component.html',
    styleUrls: ['./add-study.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStudyComponent implements OnInit {
    addStudyForm!: FormGroup;
    maxDate = new Date();
    additionalExamination: any;

    @ViewChild('addStudyDatepicker') addStudyDatepicker!: MatDatepicker<any>;

    constructor(
        public cardThirteenYService: CardThirteenYService,
        @Inject(MAT_DIALOG_DATA) public additionalExaminationsData: any,
        private snackBar: MatSnackBar,
        private cdRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.createFormGroups();
        if (this.additionalExaminationsData.exam) {
            this.initAdditionalResearchData();
        }

        this.checkAdditionalResearchDataChanges();
    }

    createFormGroups() {
        this.addStudyForm = new FormGroup({
            date: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            result: new FormControl('', Validators.required),
        });
    }

    initAdditionalResearchData() {
        console.log(this.additionalExaminationsData.exam.date);
        this.addStudyForm.controls.date.setValue(moment(this.additionalExaminationsData.exam.date), {emitEvent: false});
        this.addStudyForm.controls.name.setValue(this.additionalExaminationsData.exam.name, {emitEvent: false});
        this.addStudyForm.controls.result.setValue(this.additionalExaminationsData.exam.result, {emitEvent: false});
    }

    checkAdditionalResearchDataChanges() {
        this.addStudyForm.valueChanges.subscribe(res => {
            let studyObject = res;
            studyObject = {
                ...studyObject,
                date: moment(studyObject.date).format()
            };
            this.additionalExamination = studyObject;
        });
    }

    openDatepicker(name: string) {
        this[name].open();
    }

    getStudyMode() {
        return this.additionalExaminationsData.mode === 'edit' ? 'изменено' : 'добавлено';
    }

    saveAndClose() {
        if (this.additionalExaminationsData.exam) {
            this.additionalExaminationsData.additionalExaminations[this.additionalExaminationsData.i] = {
                ...this.addStudyForm.value,
                date: moment(this.addStudyForm.value.date).format()
            };

            this.additionalExaminationsData.formValues.additionalExaminations = this.additionalExaminationsData.additionalExaminations;
            this.cardThirteenYService.setTabCurrentValues(this.additionalExaminationsData.formValues);
            console.log(this.additionalExaminationsData.formValues);
        } else {
            this.additionalExaminationsData.additionalExaminations.push(this.additionalExamination);
            this.additionalExaminationsData.formValues.additionalExaminations = this.additionalExaminationsData.additionalExaminations;
            this.cardThirteenYService.setTabCurrentValues(this.additionalExaminationsData.formValues);
            console.log(this.additionalExaminationsData.formValues);
        }

        this.additionalExaminationsData.cdRef.detectChanges();
        this.snackBar.open('Исследование ' + this.getStudyMode(), 'ОК', {
            duration: 5000
        });
    }
}
