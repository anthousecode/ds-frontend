import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild} from '@angular/core';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDatepicker, MatSelectChange} from '@angular/material';
import {BirthdayValidator} from '../../../validators/date.validator';
import {debounceTime} from 'rxjs/operators';
import {DictionaryService} from '../../../service/dictionary.service';
import {HealthGroup, ReasonMissed} from '../../../models/dictionary.model';
import * as moment from 'moment';

@Component({
  selector: 'app-card-conclusion',
  templateUrl: './card-conclusion.component.html',
  styleUrls: ['./card-conclusion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardConclusionComponent implements OnInit {

  @ViewChild('datepickerOrthopedist') datepickerOrthopedist: MatDatepicker<any>;
  @ViewChild('datepickerChildren') datepickerChildren: MatDatepicker<any>;
  @ViewChild('datepickerDentist') datepickerDentist: MatDatepicker<any>;
  @ViewChild('datepickerPediatrician') datepickerPediatrician: MatDatepicker<any>;
  @ViewChild('datepickerOculist') datepickerOculist: MatDatepicker<any>;
  @ViewChild('datepickerChildren') datepickerSurgeon: MatDatepicker<any>;
  @ViewChild('datepickerDate') datepickerDate: MatDatepicker<any>;

  private conclusionForm: FormGroup;
  private healthGroup: HealthGroup[];
  private maxDate = new Date();
  private missedReasons: ReasonMissed[];
  private reasonsAbsence: [];
  validatorsData: {};


  constructor(private cardThirteenYService: CardThirteenYService,
              private dictionaryService: DictionaryService,
              private cdRef: ChangeDetectorRef) {
    this.validatorsData = {
      birthday: AbstractControl,
      examDate: AbstractControl,
    };
  }

  ngOnInit() {
    this.createConclusionForm();
    this.initHealthGroup();
    this.initMissedReasons();
    this.cardThirteenYService.setTabInitValues(this.conclusionForm.value);
    this.cardThirteenYService.setTabCurrentValues(null);
    this.checkFormChanges();
  }

  createConclusionForm() {
    this.conclusionForm = new FormGroup({
      inspectionForm: new FormGroup({
        orthopedist: new FormControl('', [Validators.required]),
        children: new FormControl('', [Validators.required]),
        dentist: new FormControl('', [Validators.required]),
        pediatrician: new FormControl('', [Validators.required]),
        oculist: new FormControl('', [Validators.required]),
        surgeon: new FormControl('', [Validators.required]),
      }),
      opinionForm: new FormGroup({
        healthGroup: new FormControl('', [Validators.required]),
        date: new FormControl(new Date(), [Validators.required]),
        doctor: new FormControl('', [Validators.required]),
        recommendation: new FormControl('', [Validators.required]),
        medicalExamination: new FormControl(''),
        missedReasons: new FormControl({value: '', disabled: true}),
        absence: new FormControl({value: '', disabled: true}),
        nonExecutionTextarea: new FormControl({value: '', disabled: true}),
      })
    });
  }

  initHealthGroup() {
    this.dictionaryService.getHealthGroups().subscribe((item) => {
      this.healthGroup = item;
    });
  }

  initMissedReasons() {
    this.dictionaryService.getMissedReasons().subscribe((item) => {
      this.missedReasons = item;
    });
  }

  checkFormChanges() {
    this.conclusionForm.valueChanges
      .pipe(debounceTime(800))
      .subscribe(data => this.cardThirteenYService.setTabCurrentValues(data));
  }

  openDatepicker(name: string) {
    this[name].open();
  }

  isDisabledMedicalExamination(checked) {
    if (checked) {
      this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').missedReasons.enable();
    } else {
      this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').missedReasons.disable();
      this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').missedReasons.setValue('');
    }
  }

  isDisabledMissedReasons(event: MatSelectChange) {
    if (event.source.value === 1) {
      this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.enable();
    } else {
      this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.disable();
      this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').absence.setValue('');
    }
    if (event.source.value === 6) {
      this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.enable();
    } else {
      this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.disable();
      this.cardThirteenYService.getControls(this.conclusionForm, 'opinionForm').nonExecutionTextarea.setValue('');
    }
  }
}
