import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDatepicker, MatSnackBar } from '@angular/material';
import { CardThirteenYService } from '../../../card-thirteen-y.service';
import { AdditionalResearch } from '../../interfaces/additional-research.interface';

@Component({
  selector: 'app-add-study',
  templateUrl: './add-study.component.html',
  styleUrls: ['./add-study.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStudyComponent implements OnInit {
  addStudyForm!: FormGroup;
  maxDate = new Date();

  @ViewChild('addStudyDatepicker') addStudyDatepicker!: MatDatepicker<any>;

  constructor(
    public cardThirteenYService: CardThirteenYService,
    @Inject(MAT_DIALOG_DATA) public additionalResearchData: AdditionalResearch,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.createFormGroups();
    if (this.additionalResearchData) {
      this.setAdditionalResearchData();
    }
  }

  createFormGroups() {
    this.addStudyForm = new FormGroup({
      date: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      result: new FormControl('', Validators.required),
    });
  }

  setAdditionalResearchData() {
    this.addStudyForm.get('name')
      .setValue(this.additionalResearchData.study);
    this.addStudyForm.get('date')
      .setValue(this.additionalResearchData.date);
    this.addStudyForm.get('result')
      .setValue(this.additionalResearchData.result);
  }

  openDatepicker(name: string) {
    this[name].open();
  }

  saveAndClose() {
    this.snackBar.open('Исследование добавлено', 'ОК', {
      duration: 5000
    });
  }
}
