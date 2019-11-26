import {Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {IDiagnoses} from '../../interfaces/diagnoses.interface';
import {debounceTime, filter} from 'rxjs/operators';
import {
  DispensaryObservation,
  Mkb10,
  TreatmentCondition,
  TreatmentOrganizationType
} from '../../../../../models/dictionary.model';
import {DictionaryService} from '../../../../../service/dictionary.service';

@Component({
  selector: 'app-add-diagnosis-after',
  templateUrl: './add-diagnosis-after.component.html',
  styleUrls: ['./add-diagnosis-after.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDiagnosisAfterComponent implements OnInit {
  addDiagnosisAfterForm!: FormGroup;

  diagnosticObservationValues!: DispensaryObservation[];
  diagnosisList!: Mkb10[];
  treatmentCondition!: TreatmentCondition[];
  treatmentOrganizationTypes!: TreatmentOrganizationType[];

  medOrganizationTypeVisible = true;
  medOrgTypeAppointedVisible = true;
  medOrgTypeDoneVisible = true;
  sklPrescribedMedTypeVisible = true;

  constructor(private cardThirteenYService: CardThirteenYService,
              private dictionaryService: DictionaryService,
              private cdRef: ChangeDetectorRef,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<AddDiagnosisAfterComponent>,
              @Inject(MAT_DIALOG_DATA) public diagnosisData: IDiagnoses) {
  }

  ngOnInit() {
    this.initFormGroups();
    if (this.diagnosisData) {
      this.setDiagnosisData();
    }
    this.getDiagnosisList();
    this.getTreatmentOrganizationTypes();
    this.getDispensaryObservations();
    this.getTreatmentCondition();

    this.changeMedOrganizationTypeVisibleState();
    this.changeAdditionalConsultationsAppointedVisibleState();
    this.changeAdditionalConsultationsDoneVisibleState();
    this.changeSklPrescribedMedTypeVisibleState();

    this.addDiagnosisAfterForm.valueChanges.subscribe(q => console.log(q));
  }

  initFormGroups() {
    this.addDiagnosisAfterForm = new FormGroup({
      diagnosisInfo: new FormGroup({
        almostHealthy: new FormControl(''),
        diagnosisFirstTime: new FormControl(''),
        diagnosisName: new FormControl('', [Validators.required]),
        diagnosisId: new FormControl('', [Validators.required])
      }),
      dispensaryObservation: new FormControl(3, [Validators.required]),
      treatmentPrescribed: new FormGroup({
        ambulatoryConditions: new FormControl(1, [Validators.required]),
        medOrganizationType: new FormControl('', [Validators.required])
      }),
      additionalConsultationsAppointed: new FormGroup({
        isAdditionalConsultation: new FormControl(1, [Validators.required]),
        medOrgTypeAppointed: new FormControl('')
      }),
      additionalConsultationsDone: new FormGroup({
        isAdditionalConsultation: new FormControl(1, [Validators.required]),
        medOrgTypeDone: new FormControl('')
      }),
      medSklPrescribed: new FormGroup({
        sklPrescribedAmbulatoryConditions: new FormControl(1, [Validators.required]),
        sklPrescribedMedType: new FormControl('')
      }),
      medicalHelp: new FormControl('', [Validators.required]),
      recommendations: new FormControl('', [Validators.required])
    });
  }

  setControlInfo(groupName: string, controlKey: string, checkValue: string) {
    if (this[controlKey + 'List']) {
      const infoObject = this[controlKey + 'List'].find(item => {
        return item[checkValue] === this.cardThirteenYService.getControls(this.addDiagnosisAfterForm, groupName)[controlKey + 'Name'].value;
      });
      if (infoObject) {
        this[controlKey + 'Info'] = infoObject;
        this.cdRef.detectChanges();
        this.cardThirteenYService.getControls(this.addDiagnosisAfterForm, groupName)[controlKey + 'Id'].setValue(infoObject.id);
      }
    }
  }

  getDispensaryObservations() {
    this.dictionaryService.getDispensaryObservations().subscribe(data => {
      this.diagnosticObservationValues = data;
      this.cdRef.detectChanges();
    });
  }

  getTreatmentOrganizationTypes() {
    this.dictionaryService.getTreatmentOrganizationTypes().subscribe(data => {
      this.treatmentOrganizationTypes = data;
      this.cdRef.detectChanges();
    });
  }

  getTreatmentCondition() {
    this.dictionaryService.getTreatmentConditions().subscribe(data => {
      this.treatmentCondition = data;
      this.cdRef.detectChanges();
    });
  }

  getDiagnosisList() {
    this.cardThirteenYService.getControls(this.addDiagnosisAfterForm, 'diagnosisInfo').diagnosisName.valueChanges
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
    this.cardThirteenYService.getControls(this.addDiagnosisAfterForm, 'treatmentPrescribed')
      .ambulatoryConditions.valueChanges.subscribe((value: number) => {
      this.checkVisibilityConditions(value, 'treatmentPrescribed', 'medOrganizationType');
    });
  }

  changeAdditionalConsultationsAppointedVisibleState() {
    this.cardThirteenYService.getControls(this.addDiagnosisAfterForm, 'additionalConsultationsAppointed')
      .isAdditionalConsultation.valueChanges.subscribe((value: number) => {
        this.checkVisibilityConditions(value, 'additionalConsultationsAppointed', 'medOrgTypeAppointed');
    });
  }

  changeAdditionalConsultationsDoneVisibleState() {
    this.cardThirteenYService.getControls(this.addDiagnosisAfterForm, 'additionalConsultationsDone')
      .isAdditionalConsultation.valueChanges.subscribe((value: number) => {
      this.checkVisibilityConditions(value, 'additionalConsultationsDone', 'medOrgTypeDone');
    });
  }

  changeSklPrescribedMedTypeVisibleState() {
    this.cardThirteenYService.getControls(this.addDiagnosisAfterForm, 'medSklPrescribed')
      .sklPrescribedAmbulatoryConditions.valueChanges.subscribe((value: number) => {
      this.checkVisibilityConditions(value, 'medSklPrescribed', 'sklPrescribedMedType');
    });
  }

  checkVisibilityConditions(value: number, groupName: string, controlKey: string) {
    if (value === 4) {
      this[controlKey + 'Visible'] = false;
      this.cardThirteenYService.getControls(this.addDiagnosisAfterForm, groupName)[controlKey].setValue('');
    } else {
      this[controlKey + 'Visible'] = true;
    }
  }

  setDiagnosisData() {
    this.cardThirteenYService.getControls(this.addDiagnosisAfterForm, 'diagnosisInfo').diagnosisName
      .setValue(this.diagnosisData.diagnosis);
  }

  saveAndClose() {
    this.dialogRef.close();
    this.snackBar.open('Диагноз добавлен', 'ОК', {
      duration: 5000
    });
  }
}
