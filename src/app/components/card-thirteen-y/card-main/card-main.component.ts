import {Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDatepicker} from '@angular/material';
import {debounceTime, filter, mergeMap} from 'rxjs/operators';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {ILabelId} from '../shared/interfaces/label-id.interface';
import {CARD_MAIN_OMS_PAYMENT} from '../shared/data/card-main-oms-payment';
import {Observable} from 'rxjs';
import {ICardMainCities} from '../shared/interfaces/card-main-cities.interface';
import {POLICY_TYPE} from '../shared/data/policy-type';
import {
    DEFAULT_POLICY_NUMBER_VALIDATORS,
    NEW_POLICY_NUMBER_VALIDATORS,
    OLD_POLICY_NUMBER_VALIDATORS
} from '../shared/data/policy-number-validators';
import {DictionaryService} from '../../../service/dictionary.service';
import {
    CurrentLocation,
    EducationalOrganization,
    InsuranceCompany,
    Organization,
    StationaryOrganization
} from '../../../models/dictionary.model';
import {IPolicyType} from '../shared/interfaces/policy-type.interface';

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
    policyType: IPolicyType[] = POLICY_TYPE;
    selectedPolicyType: number;
    selectedPolicyValue: string;
    policySeriesError!: any;
    policyNumberError!: any;
    defaultPolicyNumberValidators = DEFAULT_POLICY_NUMBER_VALIDATORS;
    oldPolicyNumberValidators = OLD_POLICY_NUMBER_VALIDATORS;
    newPolicyNumberValidators = NEW_POLICY_NUMBER_VALIDATORS;
    hospitalList!: InsuranceCompany[];
    organizationList!: Organization[];
    organizationInfo!: any;
    educationList!: EducationalOrganization[];
    educationInfo!: any;
    locationList$!: Observable<CurrentLocation[]>;
    institutionList!: StationaryOrganization[];
    institutionInfo!: any;
    formValues!: any;

    constructor(private cardThirteenYService: CardThirteenYService,
                private dictionaryService: DictionaryService,
                private cdRef: ChangeDetectorRef) {
        this.cardThirteenYService.activeTabCurrentValues
            .subscribe(data => {
                this.formValues = data;
            });
        this.cardThirteenYService.setActiveTabValid(true);
    }

    ngOnInit() {
        this.initFormGroups();
        this.getInitValues();
        this.checkIsFormValid();
        this.cardThirteenYService.setSelectedTabCurrentValues(null);
        this.getCitiesList();
        this.citiesList$.subscribe(list => this.citiesList = list);
        this.setCityCode();
        this.setActivePolicyType();
        this.checkPolicySeriesError();
        this.checkPolicyNumberError();
        this.getHospitalList();
        this.getOrganizationList();
        this.getEducationList();
        this.locationList$ = this.dictionaryService.getCurrentLocations();
        this.getInstitutionList();
        this.setOmsInfoData();
        this.setLocationDateData();
        this.setLocationPlaceData();

        this.checkFormChanges();
    }

    checkFormChanges() {
        this.mainForm.valueChanges.subscribe(data => {
            this.cardThirteenYService.setSelectedTabCurrentValues(data);
        });
    }

    checkIsFormValid() {
        this.mainForm.valueChanges.subscribe(() => {
            this.cardThirteenYService.setActiveTabValid(this.mainForm.valid);
        });
    }

    initFormGroups() {
        this.mainForm = new FormGroup({
            generalInfo: new FormGroup({
                dateBegin: new FormControl({value: '', disabled: true}, [Validators.required]),
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
                policyNumber: new FormControl(''),
                omsPayment: new FormControl(1, [Validators.required])
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
                locationDate: new FormControl('', [Validators.required]),
                institutionName: new FormControl('', [Validators.required]),
                institutionId: new FormControl('', [Validators.required]),
            })
        });
    }

    getInitValues() {
        this.cardThirteenYService.activeTabInitValues
            .subscribe(data => {
                this.formValues = data;
                // console.log(data);
                this.setFormInitValues(data);
                this.cardThirteenYService.setSelectedTabInitValues(this.mainForm.value);
            });
    }

    setOmsInfoData() {
        this.mainForm.get('omsInfo').valueChanges.subscribe(oms => {
            const omsObjectValues = {
                ...this.formValues,
                insuranceCompany: {
                    id: oms.hospitalId,
                    name: oms.hospitalName
                },
                polisSerial: oms.policySeries,
                polisNumber: oms.policyNumber,
                polisType: {
                    id: oms.policyType
                },
                payOms: {
                    id: oms.omsPayment
                }
            };
            this.cardThirteenYService.setTabCurrentValues(omsObjectValues);
        });
    }

    setLocationDateData() {
        this.cardThirteenYService.getControls(this.mainForm, 'location').locationDate.valueChanges.subscribe(date => {
            const locationDateObj = {
                ...this.formValues,
                currentLocationDate: date.format()
            };
            this.cardThirteenYService.setTabCurrentValues(locationDateObj);
        });
    }

    setLocationPlaceData() {
        this.cardThirteenYService.getControls(this.mainForm, 'location').locationPlace.valueChanges.subscribe(place => {
            const locationPlaceObj = {
                ...this.formValues,
                currentLocation: {
                    id: place
                }
            };
            this.cardThirteenYService.setTabCurrentValues(locationPlaceObj);
        });
    }

    setFormInitValues(data) {
        this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').dateBegin.setValue(data.startDate, {emitEvent: false});
        if (data.cityAoid) {
            this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').placeOfStayCode
                .setValue(data.cityAoid, {emitEvent: false});
        }
        if (data.address) {
            this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').placeOfStay
                .setValue(data.address, {emitEvent: false});
        }
        if (data.insuranceCompany) {
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').hospitalName
                .setValue(data.insuranceCompany.name, {emitEvent: false});
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').hospitalId
                .setValue(data.insuranceCompany.id, {emitEvent: false});
        }
        if (data.polisType) {
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyType.setValue(data.polisType.id, {emitEvent: false});
            this.setPolicyNumberValidator(data.polisType.id);
        }
        if (data.polisSerial) {
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policySeries.setValue(data.polisSerial, {emitEvent: false});
        }
        if (data.polisNumber) {
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.setValue(data.polisNumber, {emitEvent: false});
        }
        if (data.organizationPmsp) {
            this.cardThirteenYService.getControls(this.mainForm, 'medicalOrganization').organizationId
                .setValue(data.organizationPmsp.id, {emitEvent: false});
            this.cardThirteenYService.getControls(this.mainForm, 'medicalOrganization').organizationName
                .setValue(data.organizationPmsp.shortName, {emitEvent: false});
            this.organizationInfo = {
                address: data.organizationPmsp.address,
                fullName: data.organizationPmsp.fullName,
            };
        }
        if (data.educationalOrganization) {
            this.cardThirteenYService.getControls(this.mainForm, 'education').educationId
                .setValue(data.educationalOrganization.id, {emitEvent: false});
            this.cardThirteenYService.getControls(this.mainForm, 'education').educationName
                .setValue(data.educationalOrganization.shortName, {emitEvent: false});
            this.educationInfo = {
                address: data.educationalOrganization.address,
                fullName: data.educationalOrganization.fullName,
            };
        }
        if (data.currentLocation) {
            this.cardThirteenYService.getControls(this.mainForm, 'location').locationPlace
                .setValue(data.currentLocation.id, {emitEvent: false});
        }
        if (data.currentLocationDate) {
            this.cardThirteenYService.getControls(this.mainForm, 'location').locationDate
                .setValue(data.currentLocationDate, {emitEvent: false});
        }
        if (data.stationaryOrganization) {
            this.cardThirteenYService.getControls(this.mainForm, 'location').institutionId
                .setValue(data.stationaryOrganization.id, {emitEvent: false});
            this.cardThirteenYService.getControls(this.mainForm, 'location').institutionName
                .setValue(data.stationaryOrganization.shortName, {emitEvent: false});
            this.institutionInfo = {
                address: data.stationaryOrganization.address,
                fullName: data.stationaryOrganization.fullName,
            };
        }
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
                    const cityObject = this.citiesList.find(item => item.fullAddress === data);
                    if (cityObject) {
                        const formObjectValues = {
                            ...this.formValues,
                            cityAoid: cityObject.aoid,
                            address: cityObject.fullAddress
                        };
                        this.cardThirteenYService.setTabCurrentValues(formObjectValues);
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
                    const hospitalObject = this.hospitalList.find(item => item.name === data);
                    if (hospitalObject) {
                        this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').hospitalId.setValue(hospitalObject.id);
                    }
                }
            });
        });
    }

    setControlInfo(groupName: string, controlKey: string, objectName: string, idType: string) {
        if (this[controlKey + 'List']) {
            const infoObject = this[controlKey + 'List'].find(item => {
                return item.shortName === this.cardThirteenYService.getControls(this.mainForm, groupName)[controlKey + 'Name'].value;
            });
            if (infoObject) {
                this[controlKey + 'Info'] = infoObject;
                this.cdRef.detectChanges();
                this.cardThirteenYService.getControls(this.mainForm, groupName)[controlKey + 'Id'].setValue(infoObject[idType]);
                const objData = {
                    ...this.formValues,
                    [objectName]: {
                        [idType]: infoObject[idType],
                        shortName: infoObject.shortName,
                        address: infoObject.address,
                        fullName: infoObject.fullName,
                    }
                };
                console.log(infoObject);
                this.cardThirteenYService.setTabCurrentValues(objData);
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
        this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyType.valueChanges.subscribe((type: number) => {
            this.selectedPolicyType = type;
            policyNumberControl.setValue('');
            this.setPolicyNumberValidator(type);
        });
    }

    setPolicyNumberValidator(type) {
        const policyNumberControl = this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber;
        if (type === 2) {
            policyNumberControl.setValidators(this.oldPolicyNumberValidators);
        } else if (type === 1) {
            policyNumberControl.setValidators(this.newPolicyNumberValidators);
        } else {
            policyNumberControl.setValidators(this.defaultPolicyNumberValidators);
        }
    }

    setPolicyTypeRule() {
        if (this.selectedPolicyType === 3) {
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.setValue('001' + this.selectedPolicyValue);
        } else if (this.selectedPolicyType === 1) {
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
