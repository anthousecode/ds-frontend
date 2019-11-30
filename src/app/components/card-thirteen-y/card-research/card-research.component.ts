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
} from '@angular/forms';
import { MatDatepicker, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { CardThirteenYService } from '../card-thirteen-y.service';
import { AdditionalResearch } from '../shared/interfaces/additional-research.interface';
import { AddStudyComponent } from '../shared/dialogs/add-study/add-study.component';
import {debounceTime} from 'rxjs/operators';
import {DeleteConfirmComponent} from '../shared/dialogs/delete-confirm/delete-confirm.component';

@Component({
  selector: 'app-card-research',
  templateUrl: './card-research.component.html',
  styleUrls: ['./card-research.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardResearchComponent implements OnInit {
  researchFormGroup!: FormGroup;
  maxDate = new Date();
  additionalResearch!: Observable<AdditionalResearch[]>;

  @ViewChild('bloodDatepicker') bloodDatepicker!: MatDatepicker<any>;
  @ViewChild('urineDatepicker') urineDatepicker!: MatDatepicker<any>;
  @ViewChild('glucoseDatepicker') glucoseDatepicker!: MatDatepicker<any>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    public cardThirteenYService: CardThirteenYService
  ) {
  }

  ngOnInit() {
    this.createResearchFormGroups();
    this.additionalResearch = this.cardThirteenYService.getAdditionalResearch();
    // this.cardThirteenYService.setTabInitValues(this.researchFormGroup.value);
    // this.cardThirteenYService.setTabCurrentValues(null);
    // this.checkFormChanges();
  }

  createResearchFormGroups() {
    this.researchFormGroup = new FormGroup({
      bloodAnalysis: new FormGroup({
        dateBegin: new FormControl('', [Validators.required]),
        result: new FormControl('', [Validators.required])
      }),
      urineAnalysis: new FormGroup({
        dateBegin: new FormControl('', [Validators.required]),
        result: new FormControl('', [Validators.required])
      }),
      bloodGlucoseTests: new FormGroup({
        dateBegin: new FormControl('', [Validators.required]),
        result: new FormControl('', [Validators.required])
      })
    });
  }

  checkFormChanges() {
    this.researchFormGroup.valueChanges
      .pipe(debounceTime(800))
      .subscribe(data => this.cardThirteenYService.setTabCurrentValues(data));
  }

  addStudy() {
    this.dialog.open(AddStudyComponent, {panelClass: '__add-diagnosis-before', autoFocus: false});
    console.log(this.researchFormGroup.get('bloodAnalysis').get('dateBegin').value);
  }

  deleteStudy() {
    this.dialog.open(DeleteConfirmComponent, {panelClass: '__delete-confirm'});
  }

  editStudy(study: AdditionalResearch, event) {
    if (!this.checkDeleteClass(event)) {
      this.dialog.open(AddStudyComponent, {
        panelClass: '__add-diagnosis-before',
        autoFocus: false,
        data: study
      });
    }
  }

  checkDeleteClass(event) {
    return event.path.find(element => {
      return element.className === '__delete-diagnosis';
    });
  }

  openDatepicker(name: string) {
    this[name].open();
  }
}
