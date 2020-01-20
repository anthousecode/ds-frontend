import {Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef, ElementRef, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {IDiagnose, IHealthStatusBefore, IMkb10} from '../../interfaces/diagnoses.interface';
import {DictionaryService} from '../../../../../service/dictionary.service';
import {debounceTime, filter, map, switchMap} from 'rxjs/operators';
import {
    DispensaryObservation,
    Mkb10,
    ReasonMissed,
    TreatmentCondition,
    TreatmentOrganizationType,
    VmpNecessity
} from '../../../../../models/dictionary.model';
import {Observable, of, pipe} from 'rxjs';

@Component({
    selector: 'app-add-diagnosis',
    templateUrl: './add-diagnosis.component.html',
    styleUrls: ['./add-diagnosis.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDiagnosisComponent implements OnInit {
    modalName: string;
    addDiagnosisForm!: FormGroup;
    healthStatusBefore: IHealthStatusBefore;
    diagnose: IDiagnose;

    treatmentConditionOrgVisible = true;
    treatmentDoneOrgVisible = true;
    treatmentFailReasonOtherVisible = false;
    rehabilFailReasonOtherVisible = false;
    rehabilConditionOrgVisible = true;
    rehabilDoneOrgVisible = true;

    @ViewChild('mkb10NameInput') mkb10NameInput: ElementRef<HTMLInputElement>;

    diagnosticObservationValues!: DispensaryObservation[];
    mkb10s!: IMkb10[];
    treatmentConditionList!: TreatmentCondition[];
    reasonFailureList!: ReasonMissed[];
    treatmentOrganizationTypes!: TreatmentOrganizationType[];
    vmpNecessitiesList!: VmpNecessity[];

    constructor(private cardThirteenYService: CardThirteenYService,
                private dictionaryService: DictionaryService,
                private snackBar: MatSnackBar,
                private cdRef: ChangeDetectorRef,
                private dialogRef: MatDialogRef<AddDiagnosisComponent>,
                @Inject(MAT_DIALOG_DATA) public cardHealthStatusData) {
    }

    ngOnInit() {
        this.modalName = this.cardHealthStatusData.modalName;

        if (this.cardHealthStatusData.healthStatusBefore) {
            this.healthStatusBefore = this.cardHealthStatusData.healthStatusBefore;
            this.diagnose = this.cardHealthStatusData.healthStatusBefore.diagnoses[this.cardHealthStatusData.i];
            this.initFormGroups();
            this.setTreatmentConditionVisibleDependencies(this.diagnose.treatmentCondition.id);
            this.setTreatmentDoneVisibleDependencies(this.diagnose.treatmentDone.id);

            if (this.diagnose.treatmentFailReason) {
                this.setTreatmentFailReasonVisibleDependencies(this.diagnose.treatmentFailReason.id);
            }

            this.setRehabilConditionVisibleDependencies(this.diagnose.rehabilCondition.id);
            this.setRehabilDoneVisibleDependencies(this.diagnose.rehabilDone.id);

            if (this.diagnose.rehabilFailReason) {
                this.setRehabilFailReasonVisibleDependencies(this.diagnose.rehabilFailReason.id);
            }
        } else {
            this.initFormGroups();
            this.setTreatmentConditionVisibleDependencies(1);
        }

        this.getDiagnosisList();
        this.getTreatmentOrganizationTypes();
        this.getDispensaryObservations();
        this.getTreatmentConditions();
        this.getMissedReasons();
        this.getVmpNecessities();

        this.subscribeForm();
    }

    initFormGroups() {
        this.addDiagnosisForm = new FormGroup({
            diagnosisInfo: new FormGroup({
                healthGood: new FormControl({
                    value: this.healthStatusBefore && this.healthStatusBefore.healthGood ?
                        this.healthStatusBefore.healthGood : this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup ?
                            this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1 : false,
                    disabled: true
                }),
                mkb10Name: new FormControl(this.diagnose ? this.diagnose.mkb10.name : '', [Validators.required]),
                mkb10: new FormControl(this.diagnose ? this.diagnose.mkb10 : '', [Validators.required]),
            }),
            dispensaryObservation: new FormControl(
                {
                    value: this.diagnose && this.diagnose.dispensaryObservation ? this.diagnose.dispensaryObservation.id : 3,
                    disabled: this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1
                },
                [Validators.required]
            ),
            treatmentConditionGroup: new FormGroup({
                treatmentCondition: new FormControl(
                    {
                        value: this.diagnose ? this.diagnose.treatmentCondition.id : 1,
                        disabled: this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1
                    }, [Validators.required]
                ),
                treatmentConditionOrg: new FormControl(
                    {
                        value: this.diagnose && this.diagnose.treatmentConditionOrg ? this.diagnose.treatmentConditionOrg.id : '',
                        disabled: this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1
                    },
                    [Validators.required]
                )
            }),
            treatmentDoneGroup: new FormGroup({
                treatmentDone: new FormControl(
                    {
                        value: this.diagnose ? this.diagnose.treatmentDone.id : 1,
                        disabled: this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1
                    }, [Validators.required]
                ),
                treatmentDoneOrg: new FormControl(
                    {
                        value: this.diagnose && this.diagnose.treatmentDoneOrg ? this.diagnose.treatmentDoneOrg.id : '',
                        disabled: this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1
                    },
                    [Validators.required]
                )
            }),
            treatmentFailReasonGroup: new FormGroup({
                treatmentFailReason: new FormControl(
                    {
                        value: this.diagnose && this.diagnose.treatmentFailReason ? this.diagnose.treatmentFailReason.id : '',
                        disabled: true
                    },
                    [Validators.required]
                ),
                treatmentFailReasonOther: new FormControl(
                    {
                        value: this.diagnose && this.diagnose.treatmentFailReasonOther ? this.diagnose.treatmentFailReasonOther : '',
                        disabled: true
                    },
                    [Validators.required])
            }),
            rehabilConditionGroup: new FormGroup({
                rehabilCondition: new FormControl(
                    {
                        value: this.diagnose ? this.diagnose.rehabilCondition.id : 1,
                        disabled: this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1
                    }, [Validators.required]
                ),
                rehabilConditionOrg: new FormControl(
                    {
                        value: this.diagnose && this.diagnose.rehabilConditionOrg ? this.diagnose.rehabilConditionOrg.id : '',
                        disabled: this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1
                    },
                    [Validators.required]
                )
            }),
            rehabilDoneGroup: new FormGroup({
                rehabilDone: new FormControl(
                    {
                        value: this.diagnose ? this.diagnose.rehabilDone.id : 1,
                        disabled: this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1
                    }, [Validators.required]
                ),
                rehabilDoneOrg: new FormControl(
                    {
                        value: this.diagnose && this.diagnose.rehabilDoneOrg ? this.diagnose.rehabilDoneOrg.id : '',
                        disabled: this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1
                    },
                    [Validators.required]
                )
            }),
            rehabilFailReasonGroup: new FormGroup({
                rehabilFailReason: new FormControl(
                    {
                        value: this.diagnose && this.diagnose.rehabilFailReason ? this.diagnose.rehabilFailReason.id : '',
                        disabled: true
                    },
                    [Validators.required]
                ),
                rehabilFailReasonOther: new FormControl(
                    {
                        value: this.diagnose && this.diagnose.rehabilFailReasonOther ? this.diagnose.rehabilFailReasonOther : '',
                        disabled: true
                    },
                    [Validators.required]
                )
            }),
            needVmp: new FormControl({
                value: this.diagnose ? this.diagnose.needVmp.id : 1,
                disabled: this.cardHealthStatusData.formValues.healthStatusBefore.healthGroup.id === 1
            }, [Validators.required])
        });
    }

    subscribeForm() {
        // need mkb10 === mkb10Name
        this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'diagnosisInfo').mkb10Name.valueChanges
            .subscribe((mkb10Name: string) => {
                if (this.cardThirteenYService
                    .getControls(this.addDiagnosisForm, 'diagnosisInfo').mkb10.value.name !== mkb10Name) {
                    this.cardThirteenYService
                        .getControls(this.addDiagnosisForm, 'diagnosisInfo').mkb10Name.setErrors({validDiagnose: true});
                }
            });

        // Лечение было назначено/Амбулаторные условия (diagnose)
        this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'treatmentConditionGroup').treatmentCondition.valueChanges
            .subscribe(id => {
                this.setTreatmentConditionVisibleDependencies(id);
            });

        // Лечение было выполнено/Амбулаторные условия (diagnose)
        this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'treatmentDoneGroup').treatmentDone.valueChanges
            .subscribe(id => {
                this.setTreatmentDoneVisibleDependencies(id);
            });

        // Лечение было выполнено/Причина невыполнения в соответствии со значением (diagnose)
        this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReason.valueChanges
            .subscribe(id => {
                this.setTreatmentFailReasonVisibleDependencies(id);
            });

        // Медицинская реабилитация_санатарно курортное лечение были назначены/Амбулаторные условия (diagnose)
        this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'rehabilConditionGroup').rehabilCondition.valueChanges
            .subscribe(id => {
                this.setRehabilConditionVisibleDependencies(id);
            });

        // Медицинская реабилитация_санатарно курортное лечение были выполнены/Амбулаторные условия (diagnose)
        this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'rehabilDoneGroup').rehabilDone.valueChanges
            .subscribe(id => {
                this.setRehabilDoneVisibleDependencies(id);
            });

        /* Медицинская реабилитация_санатарно курортное лечение были выполнены/
        Причина невыполнения в соответствии со значением (реабилитации) */
        this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReason.valueChanges
            .subscribe(id => {
                this.setRehabilFailReasonVisibleDependencies(id);
            });
    }

    checkMkb10(mkb10: IMkb10) {
        this.cardThirteenYService.getControls(this.addDiagnosisForm, 'diagnosisInfo').mkb10Name.setValue(mkb10.name);
        this.cardThirteenYService.getControls(this.addDiagnosisForm, 'diagnosisInfo').mkb10.setValue(mkb10);

        setTimeout(() => {
            this.mkb10NameInput.nativeElement.blur();
        });
    }

    getTreatmentOrganizationTypes() {
        return this.dictionaryService.getTreatmentOrganizationTypes()
            .subscribe(data => {
                this.treatmentOrganizationTypes = data;
                this.cdRef.detectChanges();
            });
    }

    getDispensaryObservations() {
        return this.dictionaryService.getDispensaryObservations()
            .subscribe(data => {
                this.diagnosticObservationValues = data;
                this.cdRef.detectChanges();
            });
    }

    getTreatmentConditions() {
        this.dictionaryService.getTreatmentConditions().subscribe(data => {
            this.treatmentConditionList = data;
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
        this.cardThirteenYService.getControls(this.addDiagnosisForm, 'diagnosisInfo').mkb10Name.valueChanges
            .pipe(
                filter(value => value !== ''),
                debounceTime(500),
                filter(text => this.mkb10s ? !this.mkb10s.find(item => item.name === text) : true),
            ).subscribe(data => {
            this.dictionaryService.getMkb10s(1, 50, data)
                .subscribe((mkb10s: IMkb10[]) => {
                    const {healthGroup, healthGood} = this.cardHealthStatusData.formValues.healthStatusBefore;
                    this.mkb10s = mkb10s.filter(mkb10 => {
                        return healthGroup.id === 1 || healthGood ? mkb10.code === 'Z00' : mkb10;
                    });
                    this.cdRef.detectChanges();
                });
        });
    }

    setTreatmentConditionVisibleDependencies(id) {
        if (id === 4) {
            this.treatmentConditionOrgVisible = false;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentConditionGroup').treatmentConditionOrg.reset();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentConditionGroup').treatmentConditionOrg.disable();
        } else {
            this.treatmentConditionOrgVisible = true;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentConditionGroup').treatmentConditionOrg.enable();
        }
    }

    setTreatmentDoneVisibleDependencies(id) {
        if (id === 4) {
            this.treatmentDoneOrgVisible = false;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentDoneGroup').treatmentDoneOrg.reset();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentDoneGroup').treatmentDoneOrg.disable();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReason.enable();
        } else {
            this.treatmentDoneOrgVisible = true;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentDoneGroup').treatmentDoneOrg.enable();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReason.reset();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReason.disable();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReasonOther.reset();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReasonOther.disable();
        }
    }

    setTreatmentFailReasonVisibleDependencies(id) {
        if (id === 6) {
            this.treatmentFailReasonOtherVisible = true;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReasonOther.enable();
        } else {
            this.treatmentFailReasonOtherVisible = false;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReasonOther.reset();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReasonOther.disable();
        }
    }

    setRehabilConditionVisibleDependencies(id) {
        if (id === 4) {
            this.rehabilConditionOrgVisible = false;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilConditionGroup').rehabilConditionOrg.reset();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilConditionGroup').rehabilConditionOrg.disable();
        } else {
            this.rehabilConditionOrgVisible = true;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilConditionGroup').rehabilConditionOrg.enable();
        }
    }

    setRehabilDoneVisibleDependencies(id) {
        if (id === 4) {
            this.rehabilDoneOrgVisible = false;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilDoneGroup').rehabilDoneOrg.reset();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilDoneGroup').rehabilDoneOrg.disable();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReason.enable();

        } else {
            this.rehabilDoneOrgVisible = true;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilDoneGroup').rehabilDoneOrg.enable();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReason.reset();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReason.disable();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReasonOther.reset();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReasonOther.disable();
        }
    }

    setRehabilFailReasonVisibleDependencies(id) {
        if (id === 6) {
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReasonOther.enable();
            this.rehabilFailReasonOtherVisible = true;
        } else {
            this.rehabilFailReasonOtherVisible = false;
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReasonOther.reset();
            this.cardThirteenYService.getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReasonOther.disable();
        }
    }

    setDiagnose() {
        // Практически здоров healthStatusBefore
        const healthGood = this.cardThirteenYService.getControls(this.addDiagnosisForm, 'diagnosisInfo').healthGood.value;
        this.healthStatusBefore = {
            ...this.healthStatusBefore,
            healthGood
        };

        // Диагноз diagnose object
        const mkb10 = this.cardThirteenYService.getControls(this.addDiagnosisForm, 'diagnosisInfo').mkb10.value;
        this.diagnose = {
            ...this.diagnose,
            mkb10
        };

        // Диагноз Диспансерное наблюдение
        const dispensaryObservationId = this.addDiagnosisForm.get('dispensaryObservation').value;
        this.diagnose = {
            ...this.diagnose,
            dispensaryObservation: this.diagnosticObservationValues[dispensaryObservationId - 1]
        };

        // Лечение было назначено/Амбулаторные условия (diagnose)
        const treatmentConditionId = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'treatmentConditionGroup').treatmentCondition.value;
        this.diagnose = {
            ...this.diagnose,
            treatmentCondition: this.treatmentConditionList[treatmentConditionId - 1]
        };

        // Лечение было назначено/Выберите тип медицинской организации (diagnose)
        const treatmentConditionOrgId = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'treatmentConditionGroup').treatmentConditionOrg.value;

        if (treatmentConditionOrgId) {
            this.diagnose = {
                ...this.diagnose,
                treatmentConditionOrg: this.treatmentOrganizationTypes[treatmentConditionOrgId - 1]
            };
        }


        // Лечение было выполнено/Амбулаторные условия (diagnose)
        const treatmentDoneId = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'treatmentDoneGroup').treatmentDone.value;
        this.diagnose = {
            ...this.diagnose,
            treatmentDone: this.treatmentConditionList[treatmentDoneId - 1]
        };

        // Лечение было выполнено/Выберите тип медицинской организации (diagnose)
        const treatmentDoneOrgId = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'treatmentDoneGroup').treatmentDoneOrg.value;

        if (treatmentDoneOrgId) {
            this.diagnose = {
                ...this.diagnose,
                treatmentDoneOrg: this.treatmentOrganizationTypes[treatmentDoneOrgId - 1]
            };
        }

        // Лечение было выполнено/Причина невыполнения в соответствии со значением (diagnose)
        const reasonValueId = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReason.value;

        if (reasonValueId) {
            this.diagnose = {
                ...this.diagnose,
                treatmentFailReason: this.reasonFailureList[reasonValueId - 1]
            };
        }

        // Лечение было выполнено/Причина невыполнения в соответствии со значением/прочие (diagnose)
        const treatmentFailReasonOther = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'treatmentFailReasonGroup').treatmentFailReasonOther.value;

        if (treatmentFailReasonOther) {
            this.diagnose = {
                ...this.diagnose,
                treatmentFailReasonOther
            };
        }

        // Медицинская реабилитация_санатарно курортное лечение были назначены/Амбулаторные условия (diagnose)
        const sklPrescribedtreatmentConditionId = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'rehabilConditionGroup').rehabilCondition.value;
        this.diagnose = {
            ...this.diagnose,
            rehabilCondition: this.treatmentConditionList[sklPrescribedtreatmentConditionId - 1]
        };

        // Медицинская реабилитация_санатарно курортное лечение были назначены/Выберите тип медицинской организации (diagnose)
        const sklPrescribedMedTypeId = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'rehabilConditionGroup').rehabilConditionOrg.value;

        if (sklPrescribedMedTypeId) {
            this.diagnose = {
                ...this.diagnose,
                rehabilConditionOrg: this.treatmentOrganizationTypes[sklPrescribedMedTypeId - 1]
            };
        }

        // Медицинская реабилитация_санатарно курортное лечение были выполнены/Амбулаторные условия (diagnose)
        const sklPerformedtreatmentConditionId = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'rehabilDoneGroup').rehabilDone.value;

        this.diagnose = {
            ...this.diagnose,
            rehabilDone: this.treatmentConditionList[sklPerformedtreatmentConditionId - 1]
        };

        // Медицинская реабилитация_санатарно курортное лечение были выполнены/Выберите тип медицинской организации (diagnose)
        const sklPerformedMedTypeId = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'rehabilDoneGroup').rehabilDoneOrg.value;

        if (sklPerformedMedTypeId) {
            this.diagnose = {
                ...this.diagnose,
                rehabilDoneOrg: this.treatmentOrganizationTypes[sklPerformedMedTypeId - 1]
            };
        }

        /* Медицинская реабилитация_санатарно курортное лечение были выполнены/
        Причина невыполнения в соответствии со значением (реабилитации) */
        const performedReasonValueId = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReason.value;

        if (performedReasonValueId) {
            this.diagnose = {
                ...this.diagnose,
                rehabilFailReason: this.reasonFailureList[performedReasonValueId - 1]
            };
        }


        const rehabilFailReasonOther = this.cardThirteenYService
            .getControls(this.addDiagnosisForm, 'rehabilFailReasonGroup').rehabilFailReasonOther.value;

        if (rehabilFailReasonOther) {
            this.diagnose = {
                ...this.diagnose,
                rehabilFailReasonOther
            };
        }

        // Высокотехнологичная медицинская помощь (diagnose)
        const medicalHelpId = this.addDiagnosisForm.get('needVmp').value;
        this.diagnose = {
            ...this.diagnose,
            needVmp: this.vmpNecessitiesList[medicalHelpId - 1]
        };
    }

    saveAndClose() {
        this.setDiagnose();

        if (this.cardHealthStatusData.healthStatusBefore) {
            this.healthStatusBefore.diagnoses[this.cardHealthStatusData.i] = this.diagnose;
            this.cardHealthStatusData.formValues.healthStatusBefore = this.healthStatusBefore;
        } else {
            this.healthStatusBefore = {
                ...this.cardHealthStatusData.formValues.healthStatusBefore,
                ...this.healthStatusBefore
            };

            if (!this.healthStatusBefore.diagnoses) {
                this.healthStatusBefore.diagnoses = [];
            }

            this.healthStatusBefore.diagnoses.push(this.diagnose);
            this.cardHealthStatusData.formValues.healthStatusBefore = this.healthStatusBefore;
        }

        this.dialogRef.close();
        this.snackBar.open('Диагноз добавлен', 'ОК', {
            duration: 5000
        });
    }
}
