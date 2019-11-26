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

import { AccountingFormValue, AgeGroupValue } from '../../interfaces';
import { ChildCategoryValue } from '../../interfaces';
import { MatDatepicker } from '@angular/material';
import { CardCreateService } from '../../../card-create.service';
import { CARD_DATA } from '../../data/card';
import { DateExaminationValidator } from '../../../../../validators/date.validator';
import { CardService } from '../../../../../@core/shared/services/card.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-create-modal',
  templateUrl: './card-create-modal.component.html',
  styleUrls: ['./card-create-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardCreateModalComponent implements OnInit {
  cardData = CARD_DATA;
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
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.createForm();
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

  createCard() {
    const newCard = {
      card: {
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

    this.cardData.card.type = newCard.card.type;
    this.cardData.card.childCategory = newCard.card.childCategory;
    this.cardData.card.ageGroup = newCard.card.ageGroup;
    this.cardData.card.startDate = newCard.card.startDate;

    this.cardCreateService.createCard(this.cardData).subscribe(res => {
      this.cardService.setThirteenYCardId(res.id);
      this.router.navigate(['/card-13y']).then();
    });
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

  openDatepicker(name: string) {
    this[name].open();
  }
}
