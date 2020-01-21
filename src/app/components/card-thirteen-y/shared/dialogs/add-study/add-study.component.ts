import {Component, OnInit, ChangeDetectionStrategy, ViewChild, Inject, Self} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDatepicker, MatSnackBar} from '@angular/material';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import * as moment from 'moment';
import {NgOnDestroy} from '../../../../../@core/shared/services/destroy.service';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-add-study',
    templateUrl: './add-study.component.html',
    styleUrls: ['./add-study.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgOnDestroy]
})
export class AddStudyComponent implements OnInit {
    addStudyForm!: FormGroup;
    maxDate = new Date();
    additionalExamination: any;

    @ViewChild('addStudyDatepicker') addStudyDatepicker!: MatDatepicker<any>;

    constructor(public cardThirteenYService: CardThirteenYService,
                @Inject(MAT_DIALOG_DATA) public additionalExaminationsData: any,
                private snackBar: MatSnackBar,
                @Self() private onDestroy$: NgOnDestroy) {
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
        this.addStudyForm.controls.date.setValue(moment(this.additionalExaminationsData.exam.date), {emitEvent: false});
        this.addStudyForm.controls.name.setValue(this.additionalExaminationsData.exam.name, {emitEvent: false});
        this.addStudyForm.controls.result.setValue(this.additionalExaminationsData.exam.result, {emitEvent: false});
    }

    checkAdditionalResearchDataChanges() {
        this.addStudyForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
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

    saveAndClose() {
        let snackBarMessage = 'Исследование добавлено';
        if (this.additionalExaminationsData.exam) {
            snackBarMessage = 'Исследование изменено';
            this.additionalExaminationsData.additionalExaminations[this.additionalExaminationsData.index] = {
                ...this.addStudyForm.value,
                date: moment(this.addStudyForm.value.date).format()
            };
            this.additionalExaminationsData.formValues.additionalExaminations = this.additionalExaminationsData.additionalExaminations;
            console.log(this.additionalExaminationsData);
        } else {
            this.additionalExaminationsData.additionalExaminations.push(this.additionalExamination);
            this.additionalExaminationsData.formValues.additionalExaminations = this.additionalExaminationsData.additionalExaminations;
        }

        this.snackBar.open(snackBarMessage, 'ОК', {duration: 5000});
    }
}
