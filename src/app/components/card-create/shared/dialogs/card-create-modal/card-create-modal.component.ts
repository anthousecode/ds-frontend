import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ViewChild,
    ChangeDetectorRef
} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

import {AccountingFormValue, AgeGroupValue} from '../../interfaces';
import {ChildCategoryValue} from '../../interfaces';
import {MatDatepicker} from '@angular/material';
import {CardCreateService} from '../../../card-create.service';
import {CARD_DATA} from '../../data/card';
import {DateExaminationValidator} from '../../../../../validators/date.validator';
import {CardService} from '../../../../../@core/shared/services/card.service';
import {Router} from '@angular/router';
import {PatientService} from '../../../../../service/patient.service';
import {Patient} from '../../../../../models/patient.model';

@Component({
    selector: 'app-card-create-modal',
    templateUrl: './card-create-modal.component.html',
    styleUrls: ['./card-create-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardCreateModalComponent implements OnInit {
    patient: Patient;
    maxDate = new Date();
    cardCreateForm: FormGroup;
    accountingFormId = 1;
    childCategoryId = 3;
    ageGroupId = 0;
    accountingFormValues: AccountingFormValue[];
    childCategoryValues: ChildCategoryValue[];
    ageGroupValues: AgeGroupValue[];

    @ViewChild('surveyStartDateDatepicker')
    surveyStartDateDatepicker!: MatDatepicker<any>;

    constructor(
        private cardCreateService: CardCreateService,
        private cardService: CardService,
        private patientService: PatientService,
        private router: Router,
        private cdRef: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        this.createForm();
        this.getInitData();
    }

    private get accountingFormControl(): AbstractControl {
        return this.cardCreateForm.get('accountingFormControl');
    }

    private get childCategoryControl(): AbstractControl {
        return this.cardCreateForm.get('childCategoryControl');
    }

    private get ageGroupControl(): AbstractControl {
        return this.cardCreateForm.get('ageGroupControl');
    }

    private get surveyStartDateControl(): AbstractControl {
        return this.cardCreateForm.get('surveyStartDateControl');
    }

    private createForm() {
        this.cardCreateForm = new FormGroup({
            accountingFormControl: new FormControl('', [Validators.required]),
            childCategoryControl: new FormControl('', [Validators.required]),
            ageGroupControl: new FormControl('', [Validators.required]),
            surveyStartDateControl: new FormControl(new Date().toISOString(), [
                Validators.required, DateExaminationValidator
            ])
        });
    }

    private getInitData() {
        this.cardCreateService
            .getCardTypes()
            .subscribe((data: AccountingFormValue[]) => {
                data.length = 2;
                this.accountingFormValues = data;
                this.accountingFormControl.setValue(data[this.accountingFormId].id);
                this.cdRef.detectChanges();
            });

        this.cardCreateService.getChildCategories().subscribe(data => {
            this.childCategoryValues = data;
            this.childCategoryControl.setValue(data[this.childCategoryId].id);
            this.cdRef.detectChanges();
        });

        this.cardCreateService.getAgeGroups().subscribe(data => {
            this.ageGroupValues = data;
            this.ageGroupControl.setValue(data[this.ageGroupId].id);
            this.cdRef.detectChanges();
        });

        this.patientService.getPatient(this.cardService.patientId).subscribe(patient => this.patient = patient);
    }


    private createCard() {
        const newCard = {
            card: {
                patient: this.patient,
                type: {
                    id: this.accountingFormControl.value,
                    name: this.accountingFormValues[this.accountingFormControl.value - 1]
                        .name
                },
                childCategory: {
                    id: this.childCategoryControl.value,
                    categoryName: this.childCategoryValues[
                    this.childCategoryControl.value - 1
                        ].categoryName
                },
                ageGroup: {
                    id: this.ageGroupControl.value,
                    name: this.ageGroupValues[this.ageGroupControl.value - 1].name
                },
                startDate: this.surveyStartDateControl.value
            }
        };

        this.cardCreateService.createCard(newCard).subscribe(res => {
            this.cardService.setThirteenYCardId(res.id);
            this.router.navigate(['/card-13y']).then();
            console.log(res);
        });
    }

    private openDatepicker(name: string) {
        this[name].open();
    }
}
