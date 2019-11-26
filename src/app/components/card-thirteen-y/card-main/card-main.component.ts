import {Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDatepicker} from '@angular/material';
import {debounceTime, filter, mergeMap} from 'rxjs/operators';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {ILabelId} from '../shared/interfaces/label-id.interface';
import {CARD_MAIN_OMS_PAYMENT} from '../shared/data/card-main-oms-payment';
import {Observable} from 'rxjs';
import {ICardMainCities, ICardMainCityInfo} from '../shared/interfaces/card-main-cities.interface';
import {ICardMainLocationPlace} from '../shared/interfaces/card-main-location-place.interface';
import {POLICY_TYPE} from '../shared/data/policy-type';
import {
  DEFAULT_POLICY_NUMBER_VALIDATORS,
  NEW_POLICY_NUMBER_VALIDATORS,
  OLD_POLICY_NUMBER_VALIDATORS
} from '../shared/data/policy-number-validators';
// import {IHospitalInfo} from '../shared/interfaces/hospital-info.interface';
import {ICardMainControlBaseInfo} from '../shared/interfaces/card-main-control-base-info.interface';
import {DictionaryService} from '../../../service/dictionary.service';
import {
  CurrentLocation,
  EducationalOrganization,
  InsuranceCompany,
  Organization,
  StationaryOrganization
} from '../../../models/dictionary.model';

@Component({
  selector: 'app-card-main',
  templateUrl: './card-main.component.html',
  styleUrls: ['./card-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardMainComponent implements OnInit {
  @ViewChild('datepicker') datepicker!: MatDatepicker<any>;
  @ViewChild('datepickerLocation') datepickerLocation!: MatDatepicker<any>;
  mainForm!: FormGroup;
  maxDate = new Date();
  citiesList$: Observable<ICardMainCities[]>;
  citiesList: ICardMainCities[];
  omsPaymentValues: ILabelId[] = CARD_MAIN_OMS_PAYMENT;
  policyType: ILabelId[] = POLICY_TYPE;
  selectedPolicyType: string | number;
  selectedPolicyValue: string;
  policySeriesError!: any;
  policyNumberError!: any;
  defaultPolicyNumberValidators = DEFAULT_POLICY_NUMBER_VALIDATORS;
  oldPolicyNumberValidators = OLD_POLICY_NUMBER_VALIDATORS;
  newPolicyNumberValidators = NEW_POLICY_NUMBER_VALIDATORS;
  hospitalList!: InsuranceCompany[];
  organizationList!: Organization[];
  organizationInfo!: Organization;
  educationList!: EducationalOrganization[];
  educationInfo!: EducationalOrganization;
  locationList$!: Observable<CurrentLocation[]>;
  institutionList!: StationaryOrganization[];
  institutionInfo!: StationaryOrganization;

  constructor(private cardThirteenYService: CardThirteenYService,
              private dictionaryService: DictionaryService,
              private cdRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.initFormGroups();
    this.cardThirteenYService.setTabInitValues(this.mainForm.value);
    this.cardThirteenYService.setTabCurrentValues(null);
    this.checkFormChanges();
    this.getCitiesList();
    this.citiesList$.subscribe(list => {
      this.citiesList = list;
    });
    this.setCityCode();
    this.checkPolicySeriesError();
    this.setActivePolicyType();
    this.checkPolicyNumberError();
    this.getHospitalList();
    this.getOrganizationList();
    this.getEducationList();
    this.locationList$ = this.dictionaryService.getCurrentLocations();
    this.getInstitutionList();
    this.mainForm.valueChanges.subscribe((q) => console.log(q));
  }

  initFormGroups() {
    this.mainForm = new FormGroup({
      generalInfo: new FormGroup({
        dateBegin: new FormControl({value: this.maxDate, disabled: true}, [Validators.required]),
        placeOfStay: new FormControl('', [Validators.required]),
        placeOfStayCode: new FormControl('', [Validators.required])
      }),
      omsInfo: new FormGroup({
        hospitalName: new FormControl('', [Validators.required]),
        hospitalId: new FormControl('', [Validators.required]),
        policyType: new FormControl('', [Validators.required]),
        policySeries: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(6),
          Validators.pattern('^[0-9a-zA-Zа-яА-Я]+$')
        ]),
        policyNumber: new FormControl('', [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern('^[0-9a-zA-Zа-яА-Я]+$')
        ]),
        omsPayment: new FormControl('', [Validators.required])
      }),
      medicalOrganization: new FormGroup({
        organizationName: new FormControl('', [Validators.required]),
        organizationId: new FormControl('', [Validators.required]),
      }),
      education: new FormGroup({
        educationName: new FormControl('', [Validators.required]),
        educationId: new FormControl('', [Validators.required]),
      }),
      location: new FormGroup({
        locationPlace: new FormControl('', [Validators.required]),
        locationDate: new FormControl(this.maxDate, [Validators.required]),
        institutionName: new FormControl('', [Validators.required]),
        institutionId: new FormControl('', [Validators.required]),
      })
    });
  }

  checkFormChanges() {
    this.mainForm.valueChanges
      .pipe(debounceTime(800))
      .subscribe(data => this.cardThirteenYService.setTabCurrentValues(data));
  }

  getCitiesList() {
    this.citiesList$ = this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').placeOfStay.valueChanges
      .pipe(
        filter(value => value !== ''),
        debounceTime(500),
        filter(text => this.citiesList ? !this.citiesList.find(item => item.fullAddress === text) : true),
        mergeMap(value => this.cardThirteenYService.getCities(value))
      );
  }

  setCityCode() {
    this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').placeOfStay.valueChanges
      .pipe(debounceTime(500))
      .subscribe((data) => {
        if (this.citiesList) {
          const cityObject = this.citiesList.find(item => {
            return item.fullAddress === data;
          });
          if (cityObject) {
            this.cardThirteenYService.getCityInfo(cityObject.aoid).subscribe((info: ICardMainCityInfo) => {
              this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').placeOfStayCode.setValue(info.OKATO);
            });
          }
        }
      });
  }

  getHospitalList() {
    this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').hospitalName.valueChanges
      .pipe(
        filter(value => value !== ''),
        debounceTime(500),
      ).subscribe(data => {
        this.dictionaryService.getInsuranceCompanies(1, 50, data).subscribe((list: InsuranceCompany[]) => {
          this.hospitalList = list;
          this.cdRef.detectChanges();
          if (this.hospitalList) {
            const hospitalObject = this.hospitalList.find(item => {
              return item.name === data;
            });
            if (hospitalObject) {
              this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').hospitalId.setValue(hospitalObject.id);
            }
          }
        });
    });
  }

  setControlInfo(groupName: string, controlKey: string) {
    if (this[controlKey + 'List']) {
      const infoObject = this[controlKey + 'List'].find(item => {
        return item.shortName === this.cardThirteenYService.getControls(this.mainForm, groupName)[controlKey + 'Name'].value;
      });
      if (infoObject) {
        this[controlKey + 'Info'] = infoObject;
        this.cdRef.detectChanges();
        this.cardThirteenYService.getControls(this.mainForm, groupName)[controlKey + 'Id'].setValue(infoObject.id);
      }
    }
  }

  getOrganizationList() {
    this.cardThirteenYService.getControls(this.mainForm, 'medicalOrganization').organizationName.valueChanges
      .pipe(
        filter(value => value !== ''),
        debounceTime(500),
        filter(text => this.organizationList ? !this.organizationList.find(item => item.shortName === text) : true),
      ).subscribe(data => {
      this.dictionaryService.getOrganizations(1, 50, data)
        .subscribe((list: Organization[]) => {
        this.organizationList = list.filter(orgItem => orgItem);
        this.cdRef.detectChanges();
      });
    });
  }

  getEducationList() {
    this.cardThirteenYService.getControls(this.mainForm, 'education').educationName.valueChanges
      .pipe(
        filter(value => value !== ''),
        debounceTime(500),
        filter(text => this.educationList ? !this.educationList.find(item => item.shortName === text) : true),
      ).subscribe(data => {
      this.dictionaryService.getEducationalOrganizations(1, 50, data)
        .subscribe((list: EducationalOrganization[]) => {
          this.educationList = list.filter(educationItem => educationItem);
          this.cdRef.detectChanges();
        });
    });
  }

  getInstitutionList() {
    this.cardThirteenYService.getControls(this.mainForm, 'location').institutionName.valueChanges
      .pipe(
        filter(value => value !== ''),
        debounceTime(500),
        filter(text => this.institutionList ? !this.institutionList.find(item => item.shortName === text) : true),
      ).subscribe(data => {
      this.dictionaryService.getStationaryOrganizations(1, 50, data)
        .subscribe((list: StationaryOrganization[]) => {
          this.institutionList = list.filter(institutionItem => institutionItem);
          this.cdRef.detectChanges();
        });
    });
  }

  setActivePolicyType() {
    const policyNumberControl = this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber;
    this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyType.valueChanges.subscribe((type: string) => {
      this.selectedPolicyType = type;
      policyNumberControl.setValue('');
      if (type === 'old') {
        policyNumberControl.setValidators(this.oldPolicyNumberValidators);
      } else if (type === 'new') {
        policyNumberControl.setValidators(this.newPolicyNumberValidators);
      } else {
        policyNumberControl.setValidators(this.defaultPolicyNumberValidators);
      }
    });
  }

  setPolicyTypeRule() {
    if (this.selectedPolicyType === 'temporary') {
      this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.setValue('001' + this.selectedPolicyValue);
    } else if (this.selectedPolicyType === 'new') {
      const controlDischarge = this.getControlDischarge();
      this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber
        .setValue(this.selectedPolicyValue.slice(0, -1) + controlDischarge);
    }
  }

  getControlDischarge() {
    let firstTemporaryResult = '';
    let secondAction = '';
    let actionsSum = 0;
    for (let i = this.selectedPolicyValue.length - 2; i >= 0; i -= 2) {
      firstTemporaryResult += this.selectedPolicyValue[i];
    }
    const firstAction = +firstTemporaryResult * 2;
    for (let i = this.selectedPolicyValue.length - 3; i >= 0; i -= 2) {
      secondAction += this.selectedPolicyValue[i];
    }
    const thirdAction = secondAction + firstAction;
    for (let i = 0, l = thirdAction.length; i < l; i++) {
      actionsSum += Number(thirdAction[i]);
    }
    const acc = Math.ceil(actionsSum / 10) * 10;
    return acc - actionsSum;
  }

  checkPolicySeriesError() {
    this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policySeries.valueChanges.subscribe(() => {
      this.policySeriesError = this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policySeries.errors;
    });
  }

  checkPolicyNumberError() {
    this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.valueChanges.subscribe(value => {
      this.policyNumberError = this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.errors;
      this.selectedPolicyValue = value;
    });
  }

  getPolicySeriesError() {
    if (this.policySeriesError) {
      return this.policySeriesError.required ? 'Укажите серию' : 'Неверная серия полиса';
    }
  }

  getPolicyNumberError() {
    if (this.policyNumberError) {
      return this.policyNumberError.required ? 'Укажите номер' : 'Неверный номер полиса';
    }
  }

  openDatepicker(name: string) {
    this[name].open();
  }
}
