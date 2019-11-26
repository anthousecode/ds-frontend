import {Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {IDiagnoses} from '../../interfaces/diagnoses.interface';
import {DictionaryService} from '../../../../../service/dictionary.service';
import {debounceTime, filter} from 'rxjs/operators';
import {
  DispensaryObservation,
  Mkb10,
  ReasonMissed,
  TreatmentCondition,
  TreatmentOrganizationType,
  VmpNecessity
} from '../../../../../models/dictionary.model';

@Component({
  selector: 'app-add-diagnosis',
  templateUrl: './add-diagnosis.component.html',
  styleUrls: ['./add-diagnosis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDiagnosisComponent implements OnInit {
  addDiagnosisForm!: FormGroup;

  medOrganizationTypeVisible = false;
  isReasonFailureVisible = false;
  isReasonFailureTextVisible = false;
  isReasonPerformedFailureTextVisible = false;
  isSklPrescribedMedTypeVisible = true;
  isSklPerformedMedTypeVisible = true;

  diagnosticObservationValues!: DispensaryObservation[];
  diagnosisList!: Mkb10[];
  ambulatoryConditionsList!: TreatmentCondition[];
  reasonFailureList!: ReasonMissed[];
  treatmentOrganizationTypes!: TreatmentOrganizationType[];
  vmpNecessitiesList!: VmpNecessity[];

  constructor(private cardThirteenYService: CardThirteenYService,
              private dictionaryService: DictionaryService,
              private snackBar: MatSnackBar,
              private cdRef: ChangeDetectorRef,
              private dialogRef: MatDialogRef<AddDiagnosisComponent>,
              @Inject(MAT_DIALOG_DATA) public diagnosisData: IDiagnoses) { }

  ngOnInit() {
    this.initFormGroups();
    if (this.diagnosisData) {
      this.setDiagnosisData();
    }
    this.getDiagnosisList();
    this.getTreatmentOrganizationTypes();
    this.getDispensaryObservations();
    this.getTreatmentConditions();
    this.getMissedReasons();
    this.getVmpNecessities();

    this.changeMedOrganizationTypeVisibleState();
    this.changeIsReasonFailureVisibleState();
    this.changeIsReasonFailureTextVisibleState();
    this.changeIsSklPrescribedMedTypeVisibleState();
    this.changeIsSklPerformedMedTypeVisibleState();
    this.changeIsReasonPerformedFailureTextVisibleState();

    this.addDiagnosisForm.valueChanges.subscribe(q => console.log(q));
  }

  initFormGroups() {
    this.addDiagnosisForm = new FormGroup({
      diagnosisInfo: new FormGroup({
        almostHealthy: new FormControl(false),
        diagnosisName: new FormControl('', [Validators.required]),
        diagnosisId: new FormControl('', [Validators.required])
      }),
      dispensaryObservation: new FormControl(3, [Validators.required]),
      treatmentPrescribed: new FormGroup({
        ambulatoryConditions: new FormControl(4, [Validators.required]),
        medOrganizationType: new FormControl('', [Validators.required])
      }),
      treatmentPerformed: new FormGroup({
        treatmentPerformedControl: new FormControl(1, [Validators.required]),
        medOrganizationTypePerformed: new FormControl('', [Validators.required])
      }),
      reasonFailureValue: new FormGroup({
        reasonValue: new FormControl('', [Validators.required]),
        reasonValueText: new FormControl('')
      }),
      medSklPrescribed: new FormGroup({
        sklPrescribedAmbulatoryConditions: new FormControl(1, [Validators.required]),
        sklPrescribedMedType: new FormControl('')
      }),
      medSklPerformed: new FormGroup({
        sklPerformedAmbulatoryConditions: new FormControl(1, [Validators.required]),
        sklPerformedMedType: new FormControl('')
      }),
      performedReasonFailureValue: new FormGroup({
        performedReasonValue: new FormControl('', [Validators.required]),
        performedReasonValueText: new FormControl('')
      }),
      medicalHelp: new FormControl(1, [Validators.required])
    });
  }

  setControlInfo(groupName: string, controlKey: string, checkValue: string) {
    if (this[controlKey + 'List']) {
      const infoObject = this[controlKey + 'List'].find(item => {
        return item[checkValue] === this.cardThirteenYService.getControls(this.addDiagnosisForm, groupName)[controlKey + 'Name'].value;
      });
      if (infoObject) {
        this[controlKey + 'Info'] = infoObject;
        this.cdRef.detectChanges();
        this.cardThirteenYService.getControls(this.addDiagnosisForm, groupName)[controlKey + 'Id'].setValue(infoObject.id);
      }
    }
  }

  getTreatmentOrganizationTypes() {
    this.dictionaryService.getTreatmentOrganizationTypes().subscribe(data => {
      this.treatmentOrganizationTypes = data;
      this.cdRef.detectChanges();
    });
  }

  getDispensaryObservations() {
    this.dictionaryService.getDispensaryObservations().subscribe(data => {
      this.diagnosticObservationValues = data;
      this.cdRef.detectChanges();
    });
  }

  getTreatmentConditions() {
    this.dictionaryService.getTreatmentConditions().subscribe(data => {
      this.ambulatoryConditionsList = data;
      this.cdRef.detectChanges();
    });
  }

  getMissedReasons() {
    this.dictionaryService.getMissedReasons().subscribe(data => {
      this.reasonFailureList = data;
      this.cdRef.detectChanges();
    });
  }

  getVmpNecessities() {
    this.dictionaryService.getVmpNecessities().subscribe(data => {
      this.vmpNecessitiesList = data;
      this.cdRef.detectChanges();
    });
  }

  getDiagnosisList() {
    this.cardThirteenYService.getControls(this.addDiagnosisForm, 'diagnosisInfo').diagnosisName.valueChanges
      .pipe(
        filter(value => value !== ''),
        debounceTime(500),
        filter(text => this.diagnosisList ? !this.diagnosisList.find(item => item.name === text) : true),
      ).subscribe(data => {
      this.dictionaryService.getMkb10s(1, 50, data)
        .subscribe((list: Mkb10[]) => {
          this.diagnosisList = list.filter(orgItem => orgItem);
          this.cdRef.detectChanges();
        });
    });
  }

  changeMedOrganizationTypeVisibleState() {
    this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentPrescribed').ambulatoryConditions.valueChanges
      .subscribe((value: number) => {
        if (value === 4) {
          this.medOrganizationTypeVisible = false;
          this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentPrescribed').medOrganizationType.setValue('');
        } else {
          this.medOrganizationTypeVisible = true;
        }
      });
  }

  changeIsReasonFailureVisibleState() {
    this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentPerformed').treatmentPerformedControl.valueChanges
      .subscribe((value: number) => {
        if (value !== 4) {
          this.isReasonFailureVisible = false;
          this.cardThirteenYService.getControls(this.addDiagnosisForm, 'reasonFailureValue').reasonValue.setValue('');
        } else {
          this.isReasonFailureVisible = true;
          this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentPerformed').medOrganizationTypePerformed.setValue('');
        }
      });
  }

  changeIsReasonFailureTextVisibleState() {
    this.cardThirteenYService.getControls(this.addDiagnosisForm, 'reasonFailureValue').reasonValue.valueChanges
      .subscribe((value: number) => {
        if (value === 6) {
          this.isReasonFailureTextVisible = true;
        } else {
          this.isReasonFailureTextVisible = false;
          this.cardThirteenYService.getControls(this.addDiagnosisForm, 'reasonFailureValue').reasonValueText.setValue('');
        }
      });
  }

  changeIsSklPrescribedMedTypeVisibleState() {
    this.cardThirteenYService.getControls(this.addDiagnosisForm, 'medSklPrescribed').sklPrescribedAmbulatoryConditions.valueChanges
      .subscribe((value: number) => {
        if (value === 4) {
          this.isSklPrescribedMedTypeVisible = false;
        } else {
          this.isSklPrescribedMedTypeVisible = true;
          this.cardThirteenYService.getControls(this.addDiagnosisForm, 'medSklPrescribed').sklPrescribedMedType.setValue('');
        }
      });
  }

  changeIsSklPerformedMedTypeVisibleState() {
    this.cardThirteenYService.getControls(this.addDiagnosisForm, 'medSklPerformed').sklPerformedAmbulatoryConditions.valueChanges
      .subscribe((value: number) => {
        if (value === 4) {
          this.isSklPerformedMedTypeVisible = false;
        } else {
          this.isSklPerformedMedTypeVisible = true;
          this.cardThirteenYService.getControls(this.addDiagnosisForm, 'medSklPerformed').sklPerformedMedType.setValue('');
        }
      });
  }

  changeIsReasonPerformedFailureTextVisibleState() {
    this.cardThirteenYService.getControls(this.addDiagnosisForm, 'performedReasonFailureValue').performedReasonValue.valueChanges
      .subscribe((value: number) => {
        if (value === 6) {
          this.isReasonPerformedFailureTextVisible = true;
        } else {
          this.isReasonPerformedFailureTextVisible = false;
          this.cardThirteenYService.getControls(this.addDiagnosisForm, 'performedReasonFailureValue').performedReasonValueText.setValue('');
        }
      });
  }

  setDiagnosisData() {
    this.cardThirteenYService.getControls(this.addDiagnosisForm, 'diagnosisInfo').diagnosisName
      .setValue(this.diagnosisData.diagnosis);
  }

  saveAndClose() {
    this.dialogRef.close();
    this.snackBar.open('Диагноз добавлен', 'ОК', {
      duration: 5000
    });
  }
}
