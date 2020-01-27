import {Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDatepicker} from '@angular/material';
import {CardCreateService} from '../../../card-create.service';
import {DateExaminationValidator} from '../../../../../validators/date.validator';
import {CardService} from '../../../../../@core/shared/services/card.service';
import {Router} from '@angular/router';
import {DictionaryService} from '../../../../../service/dictionary.service';
import {AgeGroup, CardType, ChildCategory} from '../../../../../models/dictionary.model';
import {Patient} from '../../../../../models/patient.model';
import {PatientService} from '../../../../../service/patient.service';


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
    accountingFormValues: CardType[];
    childCategoryValues: ChildCategory[];
    ageGroupValues: AgeGroup[];

    @ViewChild('surveyStartDateDatepicker')
    surveyStartDateDatepicker!: MatDatepicker<any>;

    constructor(private cardCreateService: CardCreateService,
                private dictionaryService: DictionaryService,
                private cardService: CardService,
                private patientService: PatientService,
                private router: Router,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.createForm();
        this.getInitData();
    }

    get accountingFormControl(): AbstractControl {
        return this.cardCreateForm.get('accountingFormControl');
    }

    get childCategoryControl(): AbstractControl {
        return this.cardCreateForm.get('childCategoryControl');
    }

    get ageGroupControl(): AbstractControl {
        return this.cardCreateForm.get('ageGroupControl');
    }

    get surveyStartDateControl(): AbstractControl {
        return this.cardCreateForm.get('surveyStartDateControl');
    }

    getInitData() {
        this.dictionaryService.getCardTypes().subscribe((data: CardType[]) => {
            data.length = 2;
            this.accountingFormValues = data;
            this.accountingFormControl.setValue(data[this.accountingFormId].id);
            this.cdRef.detectChanges();
        });
        this.dictionaryService.getChildCategories().subscribe((data: ChildCategory[]) => {
            this.childCategoryValues = data;
            this.childCategoryControl.setValue(data[this.childCategoryId].id);
            this.cdRef.detectChanges();
        });
        this.dictionaryService.getAgeGroups().subscribe((data: AgeGroup[]) => {
            this.ageGroupValues = data;
            this.ageGroupControl.setValue(data[this.ageGroupId].id);
            this.cdRef.detectChanges();
        });

        this.patientService.getPatient(this.cardService.patientId).subscribe(patient => {
            this.patient = patient;
            // this.dictionaryService.getAgeGroups(patient.birthdate).subscribe(data => {
            //     this.ageGroupValues = data;
            //     this.ageGroupControl.setValue(data[this.ageGroupId].id);
            //     this.cdRef.detectChanges();
            // });
            // TODO: uncoment when patient will be younger than 18 years
        });
    }

    createCard() {
        const newCard = {
            card: {
                patient: this.patient,
                type: {
                    id: this.accountingFormControl.value,
                    name: this.accountingFormValues[this.accountingFormControl.value - 1].name
                },
                childCategory: {
                    id: this.childCategoryControl.value,
                    categoryName: this.childCategoryValues[this.childCategoryControl.value - 1].categoryName
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
        });
    }

    private createForm() {
        this.cardCreateForm = new FormGroup({
            accountingFormControl: new FormControl('', [Validators.required]),
            childCategoryControl: new FormControl('', [Validators.required]),
            ageGroupControl: new FormControl('', [Validators.required]),
            surveyStartDateControl: new FormControl(new Date().toISOString(), [Validators.required, DateExaminationValidator])
        });
    }

    openDatepicker(name: string) {
        this[name].open();
    }
}
