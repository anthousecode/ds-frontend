import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {PSYCHO_DEV_TEEN} from '../shared/data/card-thirteen-y-psycho';
import {GENDER_SELECT} from '../shared/data/card-thirteen-y-select';
import {debounceTime} from 'rxjs/operators';
import {DictionaryService} from '../../../service/dictionary.service';
import {DevelopmentDisorder, MenstrualCharacteristic} from '../../../models/dictionary.model';
import {MatRadioChange} from '@angular/material';
import {
    FEMALE_CHARASTERISTIC, MENTAL_DEVELOPMENT,
    PATIENT_SEX, PHYSICAL_DEVELOPMENT,
    SEXUAL_DEVELOPMENT_CONTROLS,
} from '../shared/data/patient_sex';

@Component({
    selector: 'app-card-development-assessment',
    templateUrl: './card-development-assessment.component.html',
    styleUrls: ['./card-development-assessment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardDevelopmentAssessmentComponent implements OnInit {
    devAssessmentForm!: FormGroup;
    private devDisordersKid: DevelopmentDisorder[];
    private devDisordersTeen: DevelopmentDisorder[] = [];
    private characteristicMenstrualFunc: MenstrualCharacteristic[];
    private psychoValue = PSYCHO_DEV_TEEN;
    private genderSelect = GENDER_SELECT;
    private patientSexId = 0;
    private patientAge;
    private PATIENT_SEX = PATIENT_SEX;
    formValues: any;

    constructor(private cardThirteenYService: CardThirteenYService,
                private dictionaryService: DictionaryService,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.createDevAssessmentForm();
        this.getActiveTabInitValues();
        this.initPhysicalDevKid();
        this.initPhysicalDevTeen();
        this.initCharacteristicMenstrualFunc();
        this.checkIsFormValid();
        // this.cardThirteenYService.setTabInitValues(this.devAssessmentForm.value);
        this.cardThirteenYService.setTabCurrentValues(null);
        this.checkFormChanges();
    }

    getActiveTabInitValues() {
        this.cardThirteenYService.activeTabInitValues.subscribe(data => {
            this.formValues = data;
            this.patientSexId = data.patient.sex.id;
            this.patientAge = Number(data.ageGroup.months / 12);
            this.setFormInitValues(data);
            const sexualDevelopmentControls = SEXUAL_DEVELOPMENT_CONTROLS.common.concat(this.patientSexId === this.PATIENT_SEX.male
                ? SEXUAL_DEVELOPMENT_CONTROLS.male
                : SEXUAL_DEVELOPMENT_CONTROLS.female);
            this.setMentalDevelopmentControls(this.patientAge <= 4 ? MENTAL_DEVELOPMENT.child : MENTAL_DEVELOPMENT.teen);
            this.setPhysicalDevelopment(this.patientAge <= 4 ? PHYSICAL_DEVELOPMENT.child : PHYSICAL_DEVELOPMENT.teen);
            if (this.patientAge > 10) {
                this.setSexualDevelopmentControls(sexualDevelopmentControls);
                if (this.patientSexId === PATIENT_SEX.female) {
                    this.setFemaleControls(FEMALE_CHARASTERISTIC);
                }
            }
            this.cardThirteenYService.setSelectedTabInitValues(this.devAssessmentForm.value);
            this.cdRef.markForCheck();
        });
    }

    setMentalDevelopmentControls(controls: string[]) {
        controls.forEach(value =>
            this.cardThirteenYService.getControls(this.devAssessmentForm, 'mentalDevelopment')[value].enable());
    }

    setPhysicalDevelopment(controls: string[]) {
        controls.forEach(value =>
            this.cardThirteenYService.getControls(this.devAssessmentForm, 'physicalDevelopment')[value].enable());
    }

    createDevAssessmentForm() {
        this.devAssessmentForm = new FormGroup({
            physicalDevelopment: new FormGroup({
                weight: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)]),
                height: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)]),
                headCircumference: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern(/^[0-9]{1,4}$/)]),
                weightDisorder: new FormControl(null),
                heightDisorder: new FormControl(null),
            }),
            mentalDevelopment: new FormGroup({
                cognitive: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]),
                motor: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]),
                emotionalAndSocial: new FormControl({value: 0, disabled: true}, [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]),
                speech: new FormControl({value: '', disabled: true}, [Validators.required, Validators.pattern(/^[0-9]{1,3}$/)]),
                psychomotor: new FormControl({value: this.psychoValue[0].id, disabled: true}, [Validators.required]),
                intellect: new FormControl({value: this.psychoValue[0].id, disabled: true}, [Validators.required]),
                emotionallyVegetative: new FormControl({value: this.psychoValue[0].id, disabled: true}, [Validators.required]),
            }),
            sexualDevelopment: new FormGroup({
                p: new FormControl({value: null, disabled: true}, [Validators.required]),
                ax: new FormControl({value: null, disabled: true}, [Validators.required]),
                fa: new FormControl({value: null, disabled: true}, [Validators.required]),
                ma: new FormControl({value: null, disabled: true}, [Validators.required]),
                me: new FormControl({value: null, disabled: true}, [Validators.required]),
                missing: new FormControl({value: null, disabled: true}),
                menarheYear: new FormControl({value: null, disabled: true}, [Validators.pattern(/^[0-9]{1,3}$/)]),
                menarheMonth: new FormControl({value: null, disabled: true}, [Validators.pattern(/^[0-9]{1,3}$/)]),
            }),
            regularity: new FormControl({value: null, disabled: true}),
            profusion: new FormControl({value: null, disabled: true}),
            soreness: new FormControl({value: null, disabled: true}),
        });
    }

    private setSexualDevelopmentControls(sexualDevelopmentControls: string[]) {
        sexualDevelopmentControls.forEach(value =>
            this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevelopment')[value].enable());
    }

    private setFemaleControls(sexualDevelopmentControls: string[]) {
        sexualDevelopmentControls.forEach(value =>
            this.devAssessmentForm.controls[value].enable());
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
            .subscribe(data => {
                this.cardThirteenYService.setSelectedTabCurrentValues(data);
                this.cardThirteenYService.setTabCurrentValues(data);
            });
    }

    checkIsFormValid() {
        this.devAssessmentForm.valueChanges.subscribe(() => {
            this.cardThirteenYService.setActiveTabValid(this.devAssessmentForm.valid);
            this.cardThirteenYService.setTabCurrentValues(this.devAssessmentForm);
        });
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

    setFormInitValues(data) {
        if (data.physicalDevelopment) {
            this.patchValueForGroup(data.physicalDevelopment, 'physicalDevelopment');
        }
        if (data.mentalDevelopment) {
            this.patchValueForGroup(data.mentalDevelopment, 'mentalDevelopment');
        }
        if (data.sexualDevelopment) {
            this.patchValueForGroup(data.sexualDevelopment, 'sexualDevelopment');
        }
    }

    patchValueForGroup(data, nameGroup: string) {
        for (const [key, value] of Object.entries(data)) {
            const control = this.cardThirteenYService.getControls(this.devAssessmentForm, nameGroup)[key];
            if (control) {
                control.setValue(value, {emitEvent: false});
            }
        }
    }

    handlerRadioButton(groupName: string, currentControl: string, value: MatRadioChange) {

        this.cardThirteenYService.getControls(this.devAssessmentForm, groupName)[currentControl].setValue(value.value);
        console.log('form', this.devAssessmentForm);

    }

    handlerRadioWithoutGroup(currentControl: string, value: MatRadioChange) {
        this.devAssessmentForm.controls[currentControl].setValue(value.value);
        console.log('form', this.devAssessmentForm);
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
            this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevelopment').menarheYear.enable();
            this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevelopment').menarheMonth.enable();
        } else {
            this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevelopment').menarheYear.disable();
            this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevelopment').menarheYear.setValue('');
            this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevelopment').menarheMonth.disable();
            this.cardThirteenYService.getControls(this.devAssessmentForm, 'sexualDevelopment').menarheMonth.setValue('');
        }
    }

    onSubmit(object: {}) {
        console.log('form submitted OBJECT', object);
    }
}
