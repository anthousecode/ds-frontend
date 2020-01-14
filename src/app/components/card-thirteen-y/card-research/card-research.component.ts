import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { MatDatepicker, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { CardThirteenYService } from '../card-thirteen-y.service';
import { AdditionalResearch } from '../shared/interfaces/additional-research.interface';
import { AddStudyComponent } from '../shared/dialogs/add-study/add-study.component';
import { debounceTime } from 'rxjs/operators';
import { DeleteConfirmComponent } from '../shared/dialogs/delete-confirm/delete-confirm.component';
import * as moment from 'moment';
import { Examination } from '../../../models/dictionary.model';
import { DictionaryService } from '../../../service/dictionary.service';

@Component({
  selector: 'app-card-research',
  templateUrl: './card-research.component.html',
  styleUrls: ['./card-research.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardResearchComponent implements OnInit {
  researchFormGroup!: FormGroup;
  requiredExaminations: Examination[];
  maxDate = new Date();
  additionalExaminations: [];
  formValues!: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    public cardThirteenYService: CardThirteenYService,
    private formBuilder: FormBuilder,
    private dictionaryService: DictionaryService
  ) {
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
    this.checkFormChanges();
  }

  get requiredExaminationsArray() {
    return this.researchFormGroup.get('requiredExaminationsArray') as FormArray;
  }

  getInitValues() {
    this.cardThirteenYService.activeTabInitValues
      .subscribe(data => {
        this.formValues = data;
        this.createResearchFormGroups();
        this.cardThirteenYService.setSelectedTabInitValues(this.researchFormGroup.value);
      });
  }

  checkFormChanges() {
    this.researchFormGroup.valueChanges.subscribe(data => {
      this.cardThirteenYService.setSelectedTabCurrentValues(data);
      console.log(data);
    });
  }

  checkIsFormValid() {
    this.researchFormGroup.valueChanges.subscribe(() => {
      this.cardThirteenYService.setActiveTabValid(this.researchFormGroup.valid);
    });
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
      this.cdRef.detectChanges();
    });
  }

  setRequiredExaminations() {
    for (let i = 0; i < this.requiredExaminationsArray.length; i++) {
      this.requiredExaminationsArray.get(`${i}`).get('dateBegin').valueChanges.subscribe(date => {
        date = date.format();
        this.formValues.requiredExaminations[i] = {
          ...this.formValues.requiredExaminations[i],
          exam: this.requiredExaminations[i],
          date,
        };

        this.cardThirteenYService.setTabCurrentValues(this.formValues);
        console.log(this.formValues);
      });
      this.requiredExaminationsArray.get(`${i}`).get('result').valueChanges.subscribe(result => {
        this.formValues.requiredExaminations[i] = {
          ...this.formValues.requiredExaminations[i],
          exam: this.requiredExaminations[i],
          result
        };

        console.log(this.formValues);
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

  deleteStudy(i) {
    this.dialog.open(DeleteConfirmComponent, {
      panelClass: '__delete-confirm',
      data: {
        arr: this.formValues.additionalExaminations,
        i,
        message: 'Исследование удалено'
      }
    }).afterClosed().subscribe(() => {
      this.cdRef.detectChanges();
      this.cardThirteenYService.setTabCurrentValues(this.formValues);
    });
  }

  editStudy(exam, i, event) {
    if (!this.checkDeleteClass(event)) {
      this.dialog.open(AddStudyComponent, {
        panelClass: '__add-diagnosis-before',
        autoFocus: false,
        data: {
          formValues: this.formValues,
          additionalExaminations: this.additionalExaminations,
          cdRef: this.cdRef,
          exam,
          i
        }
      });
    }
  }

  checkDeleteClass(event) {
    return event.path.find(element => {
      return element.className === '__delete-diagnosis';
    });
  }

  openDatepicker(name: MatDatepicker<any>) {
    name.open();
  }
}
