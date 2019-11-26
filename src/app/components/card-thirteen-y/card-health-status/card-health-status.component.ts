import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CardThirteenYService } from '../card-thirteen-y.service';
import { IDiagnoses } from '../shared/interfaces/diagnoses.interface';
import { Observable } from 'rxjs';
import { MatDatepicker, MatDialog, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { AddDiagnosisComponent } from '../shared/dialogs/add-diagnosis/add-diagnosis.component';
import { AddDiagnosisAfterComponent } from '../shared/dialogs/add-diagnosis-after/add-diagnosis-after.component';
import { debounceTime} from 'rxjs/operators';
import { DeleteConfirmComponent } from '../shared/dialogs/delete-confirm/delete-confirm.component';
import { DictionaryService } from '../../../service/dictionary.service';
import { HealthGroup, InvalidType, ReabilitationStatus } from '../../../models/dictionary.model';
import { ENTER } from '@angular/cdk/keycodes';

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

  constructor(private cardThirteenYService: CardThirteenYService,
              private dictionaryService: DictionaryService,
              private dialog: MatDialog,
              private cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.healthStatusList$ = this.dictionaryService.getHealthGroups();
    this.disabilityTypeList$ = this.dictionaryService.getInvalidTypes();
    this.doneList$ = this.dictionaryService.getReabilitationStatuses();
    this.diagnosisList = this.cardThirteenYService.getDiagnoses();
    this.diagnosisListAfter = this.cardThirteenYService.getDiagnosesAfter();
    this.initFormGroups();
    this.cardThirteenYService.setTabInitValues(this.healthStatusForm.value);
    this.cardThirteenYService.setTabCurrentValues(null);
    this.checkFormChanges();
    this.disabilityTypeChange();
    this.disableRehabilitationPerformance();
    this.disableDisabilityControls();

    this.healthStatusForm.valueChanges.subscribe(q => console.log(q));
  }

  initFormGroups() {
    this.healthStatusForm = new FormGroup({
      beforeMedicalExamination: new FormGroup({
        healthGroup: new FormControl(1, [Validators.required])
      }),
      disability: new FormGroup({
        disabilityType: new FormControl(1, [Validators.required]),
        disabilityFirstDate: new FormControl({value: '', disabled: true}, [Validators.required]),
        disabilityLastDate: new FormControl({value: '', disabled: true}, [Validators.required]),
        disabilityDiseases: new FormControl({value: '', disabled: true}, [Validators.required]),
        disabilityDisorders: new FormControl({value: '', disabled: true}, [Validators.required]),
        rehabilitationDate: new FormControl({value: '', disabled: true}, [Validators.required]),
        rehabilitationPerformance: new FormControl({value: '', disabled: true}, [Validators.required])
      })
    });
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

  checkFormChanges() {
    this.healthStatusForm.valueChanges
      .pipe(debounceTime(800))
      .subscribe(data => this.cardThirteenYService.setTabCurrentValues(data));
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
