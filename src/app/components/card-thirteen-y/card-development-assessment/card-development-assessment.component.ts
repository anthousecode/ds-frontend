import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {PSYCHO_DEV_TEEN} from '../shared/data/card-thirteen-y-psycho';
import {GENDER_SELECT} from '../shared/data/card-thirteen-y-select';
import {debounceTime} from 'rxjs/operators';
import {DictionaryService} from '../../../service/dictionary.service';
import {DevelopmentDisorder, MenstrualCharacteristic} from '../../../models/dictionary.model';

@Component({
  selector: 'app-card-development-assessment',
  templateUrl: './card-development-assessment.component.html',
  styleUrls: ['./card-development-assessment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDevelopmentAssessmentComponent implements OnInit {

  devAssessmentForm!: FormGroup;
  private devDisordersKid: DevelopmentDisorder[] = [];
  private devDisordersTeen: DevelopmentDisorder[] = [];
  private characteristicMenstrualFunc: MenstrualCharacteristic[] = [];
  private psychoValue = PSYCHO_DEV_TEEN;
  private genderSelect = GENDER_SELECT;

  constructor(private cardThirteenYService: CardThirteenYService,
              private dictionaryService: DictionaryService,
              private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.createDevAssessmentForm();
    this.initPhysicalDevKid();
    this.initPhysicalDevTeen();
    this.initCharacteristicMenstrualFunc();
    this.cardThirteenYService.setTabInitValues(this.devAssessmentForm.value);
    this.cardThirteenYService.setTabCurrentValues(null);
    this.checkFormChanges();
  }

  createDevAssessmentForm() {
    this.devAssessmentForm = new FormGroup({
      physicalDevKidForm: new FormGroup({
        weight: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)]),
        height: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)]),
        head: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)]),
      }),
      devDisordersKidForm: new FormGroup({
        thin: new FormControl(false),
        obese: new FormControl(false),
        short: new FormControl(false),
        tall: new FormControl(false),
      }),
      psychoDevKidForm: new FormGroup({
        cognitiveFunc: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]),
        motorFunc: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]),
        socialFunc: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]),
        speechFunc: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]),
      }),
      physicalDevTeenForm: new FormGroup({
        weight: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)]),
        height: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)]),
      }),
      devDisordersTeenForm: new FormGroup({
        thin: new FormControl(false),
        obese: new FormControl(false),
        short: new FormControl(false),
        tall: new FormControl(false),
      }),
      psychoDevTeenForm: new FormGroup({
        psychoMotorSphere: new FormControl(this.psychoValue[0].id, [Validators.required]),
        intelligence: new FormControl(this.psychoValue[0].id, [Validators.required]),
        emotionallySphere: new FormControl(this.psychoValue[0].id, [Validators.required]),
      }),
      sexualDevBoyForm: new FormGroup({
        p: new FormControl(this.genderSelect[0].value, [Validators.required]),
        ax: new FormControl(this.genderSelect[0].value, [Validators.required]),
        fa: new FormControl(this.genderSelect[0].value, [Validators.required]),
      }),
      sexualDevGirlForm: new FormGroup({
        p: new FormControl(this.genderSelect[0].value, [Validators.required]),
        ax: new FormControl(this.genderSelect[0].value, [Validators.required]),
        ma: new FormControl(this.genderSelect[0].value, [Validators.required]),
        me: new FormControl(this.genderSelect[0].value, [Validators.required]),
        menstrualFunc: new FormControl(''),
        year: new FormControl({value: '', disabled: true}, [Validators.pattern(/^[0-9]{1,3}$/)]),
        month: new FormControl({value: '', disabled: true}, [Validators.pattern(/^[0-9]{1,3}$/)]),
      }),
      characteristicMenstrualFuncForm: new FormGroup({
        regular: new FormControl(''),
        notRegular: new FormControl(''),
        plentiful: new FormControl(''),
        moderate: new FormControl(''),
        scarce: new FormControl(''),
        painful: new FormControl(''),
        painless: new FormControl(''),
      }),
    });
  }

  private initPhysicalDevKid() {
    this.dictionaryService.getDevelopmentDisorders().subscribe((item) => {
      this.devDisordersKid = item;
      this.cdRef.markForCheck();
    });
  }

  private initPhysicalDevTeen() {
    this.dictionaryService.getDevelopmentDisorders().subscribe((item) => {
      this.devDisordersTeen = item;
      this.cdRef.markForCheck();
    });
  }

  private initCharacteristicMenstrualFunc() {
    this.dictionaryService.getMenstrualCharacteristics().subscribe((item) => {
      this.characteristicMenstrualFunc = item;
      this.cdRef.markForCheck();
    });
  }

  checkFormChanges() {
    this.devAssessmentForm.valueChanges
      .pipe(debounceTime(800))
      .subscribe(data => this.cardThirteenYService.setTabCurrentValues(data));
  }

  private toggleCheckbox(
    controls: string[],
    currentControl: string,
    value: boolean,
    groupName: string
  ) {
    controls.forEach((control) => {
      control === currentControl ?
        this.cardThirteenYService.getControls(this.devAssessmentForm, groupName)[control].setValue(value) :
        this.cardThirteenYService.getControls(this.devAssessmentForm, groupName)[control].setValue(false);
    });
  }

  handlerWeightKid(currentControl: string, value: boolean) {
    const controls = ['thin', 'obese'];

    this.toggleCheckbox(controls, currentControl, value, 'devDisordersKidForm');
  }

  handlerHeightKid(currentControl: string, value: boolean) {
    const controls = ['short', 'tall'];

    this.toggleCheckbox(controls, currentControl, value, 'devDisordersKidForm');
  }

  handlerWeightTeen(currentControl: string, value: boolean) {
    const controls = ['thin', 'obese'];

    this.toggleCheckbox(controls, currentControl, value, 'devDisordersTeenForm');
  }

  handlerHeightTeen(currentControl: string, value: boolean) {
    const controls = ['short', 'tall'];

    this.toggleCheckbox(controls, currentControl, value, 'devDisordersTeenForm');
  }

  handlerRegularity(currentControl: string, value: boolean) {
    const controls = ['regular', 'notRegular', 'plentiful'];

    this.toggleCheckbox(controls, currentControl, value, 'characteristicMenstrualFuncForm');
  }

  handlerProfusion(currentControl: string, value: boolean) {
    const controls = ['plentiful', 'moderate', 'scarce'];

    this.toggleCheckbox(controls, currentControl, value, 'characteristicMenstrualFuncForm');
  }

  handlerSoreness(currentControl: string, value: boolean) {
    const controls = ['painful', 'painless'];

    this.toggleCheckbox(controls, currentControl, value, 'characteristicMenstrualFuncForm');
  }

  isDisabled(checked) {
    if (checked) {
      this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevGirlForm').year.enable();
      this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevGirlForm').month.enable();
    } else {
      this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevGirlForm').year.disable();
      this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevGirlForm').year.setValue('');
      this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevGirlForm').month.disable();
      this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevGirlForm').month.setValue('');
    }
  }

  onSubmit(object: {}) {
    console.log('form submitted OBJECT', object);
  }
}
