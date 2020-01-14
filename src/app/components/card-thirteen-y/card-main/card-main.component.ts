import {Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, Self} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MatDatepicker} from '@angular/material';
import {debounceTime, filter, mergeMap, takeUntil} from 'rxjs/operators';
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
import {NgOnDestroy} from '../../../@core/shared/services/destroy.service';
import {IOrganizationInfo} from '../shared/interfaces/organization-info.interface';

@Component({
    selector: 'app-card-main',
    templateUrl: './card-main.component.html',
    styleUrls: ['./card-main.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgOnDestroy]
})
export class CardMainComponent implements OnInit {
    @ViewChild('datepicker') datepicker!: MatDatepicker<any>;
    @ViewChild('datepickerLocation') datepickerLocation!: MatDatepicker<any>;
    mainForm!: FormGroup;
    maxDate = new Date();
    citiesList: ICardMainCities[];
    omsPaymentValues: ILabelId[] = CARD_MAIN_OMS_PAYMENT;
    policyType: IPolicyType[] = POLICY_TYPE;
    selectedPolicyType: number;
    selectedPolicyValue: string;
    policySeriesError!: ValidationErrors;
    policyNumberError!: ValidationErrors;
    defaultPolicyNumberValidators = DEFAULT_POLICY_NUMBER_VALIDATORS;
    oldPolicyNumberValidators = OLD_POLICY_NUMBER_VALIDATORS;
    newPolicyNumberValidators = NEW_POLICY_NUMBER_VALIDATORS;
    locationList$!: Observable<CurrentLocation[]>;
    hospitalList!: InsuranceCompany[];
    organizationList!: Organization[];
    organizationInfo!: IOrganizationInfo;
    educationList!: EducationalOrganization[];
    educationInfo!: IOrganizationInfo;
    institutionList!: StationaryOrganization[];
    institutionInfo!: IOrganizationInfo;
    formValues!: any;

    constructor(private cardThirteenYService: CardThirteenYService,
                private dictionaryService: DictionaryService,
                private cdRef: ChangeDetectorRef,
                @Self() private onDestroy$: NgOnDestroy) {
        // this.cardThirteenYService.activeTabCurrentValues
        //     .pipe(takeUntil(this.onDestroy$))
        //     .subscribe(data => this.formValues = data);
        this.cardThirteenYService.setActiveTabValid(true);
    }

    ngOnInit() {
        this.initFormGroups();
        this.getInitValues();
        this.checkIsFormValid();
        this.checkBlockState();
        // this.cardThirteenYService.setSelectedTabCurrentValues(null);
        this.getCitiesList();
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
        this.mainForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => this.cardThirteenYService.setSelectedTabCurrentValues(data));
    }

    checkIsFormValid() {
        this.mainForm.valueChanges
            .pipe(
                debounceTime(200),
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => this.cardThirteenYService.setActiveTabValid(this.mainForm.valid));
    }

    checkBlockState() {
        this.cardThirteenYService.isBlocked.subscribe(state => {
            if (state) {
                this.mainForm.disable({emitEvent: false});
                this.cardThirteenYService.setSelectedTabCurrentValues(null);
            }
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
                locationDate: new FormControl('', [Validators.required]),
                institutionName: new FormControl('', [Validators.required]),
                institutionId: new FormControl('', [Validators.required]),
            })
        });
    }

    getInitValues() {
        this.cardThirteenYService.activeTabInitValues
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(data => {
                this.formValues = data;
                this.setFormInitValues(data);
                this.cardThirteenYService.setSelectedTabInitValues(this.mainForm.value);
            });
    }

    setOmsInfoData() {
        this.mainForm.get('omsInfo').valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(oms => {
                const omsObjectValues = {
                    ...this.formValues,
                    insuranceCompany: {
                        id: oms.hospitalId,
                        name: oms.hospitalName
                    },
                    polisType: {
                        id: oms.policyType
                    },
                    polisSerial: !oms.policySeries ? '' : oms.policySeries,
                    polisNumber: oms.policyNumber,
                    payOms: {
                        id: oms.omsPayment
                    }
                };
                this.cardThirteenYService.setTabCurrentValues(omsObjectValues);
            });
    }

    setLocationDateData() {
        this.cardThirteenYService.getControls(this.mainForm, 'location').locationDate.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(date => {
                const locationDateObj = {
                    ...this.formValues,
                    currentLocationDate: typeof date === 'string' ? date : date.format()
                };
                this.cardThirteenYService.setTabCurrentValues(locationDateObj);
            });
    }

    setLocationPlaceData() {
        this.cardThirteenYService.getControls(this.mainForm, 'location').locationPlace.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(place => {
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
            this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').placeOfStayCode.setValue(data.cityAoid, {emitEvent: false});
        }
        if (data.address) {
            this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').placeOfStay.setValue(data.address, {emitEvent: false});
        }
        if (data.insuranceCompany) {
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').hospitalName
                .setValue(data.insuranceCompany.name, {emitEvent: false});
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').hospitalId
                .setValue(data.insuranceCompany.id, {emitEvent: false});
        }
        if (data.polisNumber) {
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.setValue(data.polisNumber, {emitEvent: false});
        }
        if (data.payOms) {
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').omsPayment.setValue(data.payOms.id, {emitEvent: false});
        }
        if (data.polisType) {
            this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyType.setValue(data.polisType.id, {emitEvent: false});
            this.selectedPolicyType = data.polisType.id;
            if (data.polisType.id === 2) {
                this.enablePolicySeries();
                this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policySeries.setValue(data.polisSerial, {emitEvent: false});
            } else {
                this.disablePolicySeries();
            }
            this.setPolicyNumberValidator(data.polisType.id);
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
        this.cdRef.detectChanges();
        this.cardThirteenYService.setSelectedTabCurrentValues(null);
    }

    getCitiesList() {
        this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').placeOfStay.valueChanges
            .pipe(
                filter(value => value !== ''),
                debounceTime(500),
                filter(text => this.citiesList ? !this.citiesList.find(item => item.fullAddress === text) : true),
                mergeMap(value => this.cardThirteenYService.getCities(value)),
                takeUntil(this.onDestroy$)
            )
            .subscribe(data => {
                this.citiesList = data;
                this.cdRef.detectChanges();
            })
        ;
    }

    setCityCode(cityObject) {
        if (cityObject.aolevel === 1 || cityObject.aolevel === 4) {
            const formObjectValues = {
                ...this.formValues,
                cityAoid: cityObject.aoid,
                address: cityObject.fullAddress
            };
            this.cardThirteenYService.setTabCurrentValues(formObjectValues);
        } else {
            this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').placeOfStay.setErrors({wrong: true});
        }
    }

    getHospitalList() {
        this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').hospitalName.valueChanges
            .pipe(
                filter(value => value !== ''),
                debounceTime(500),
                takeUntil(this.onDestroy$)
            )
            .subscribe(data => {
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

    setControlInfo(groupName: string, controlKey: string, objectName: string, idType: string, infoObject) {
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
        this.cardThirteenYService.setTabCurrentValues(objData);
    }

    getOrganizationList() {
        this.cardThirteenYService.getControls(this.mainForm, 'medicalOrganization').organizationName.valueChanges
            .pipe(
                filter(value => value !== ''),
                debounceTime(500),
                filter(text => this.organizationList ? !this.organizationList.find(item => item.shortName === text) : true),
                takeUntil(this.onDestroy$)
            )
            .subscribe(data => {
                this.dictionaryService.getOrganizations(1, 50, data).subscribe((list: Organization[]) => {
                    this.organizationList = list.filter(orgItem => orgItem);
                    this.cdRef.markForCheck();
                });
            });
    }

    getEducationList() {
        this.cardThirteenYService.getControls(this.mainForm, 'education').educationName.valueChanges
            .pipe(
                filter(value => value !== ''),
                debounceTime(500),
                filter(text => this.educationList ? !this.educationList.find(item => item.shortName === text) : true),
                takeUntil(this.onDestroy$)
            )
            .subscribe(data => {
                this.dictionaryService.getEducationalOrganizations(1, 50, data).subscribe((list: EducationalOrganization[]) => {
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
                takeUntil(this.onDestroy$)
            )
            .subscribe(data => {
                this.dictionaryService.getStationaryOrganizations(1, 50, data).subscribe((list: StationaryOrganization[]) => {
                    this.institutionList = list.filter(institutionItem => institutionItem);
                    this.cdRef.detectChanges();
                });
            });
    }

    setActivePolicyType() {
        const policyNumberControl = this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber;
        this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyType.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((type: number) => {
                this.selectedPolicyType = type;
                type === 2 ? this.enablePolicySeries() : this.disablePolicySeries();
                policyNumberControl.setValue('', {emitEvent: false});
                this.setPolicyNumberValidator(type);
            });
    }

    disablePolicySeries() {
        this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policySeries.disable();
        this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policySeries.setValue('', {emitEvent: false});
    }

    enablePolicySeries() {
        this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policySeries.enable({emitEvent: false});
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
        const policyNumberValue = this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.value;
        if (this.selectedPolicyType === 3) {
            if (policyNumberValue.substring(0, 3) !== '001') {
                this.setPolicyNumberError();
            }
        } else if (this.selectedPolicyType === 1) {
            const controlDischarge = this.getControlDischarge();
            const correctNumberValue = this.selectedPolicyValue.slice(0, -1) + controlDischarge;
            if (policyNumberValue !== correctNumberValue) {
                this.setPolicyNumberError();
            }
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
        this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policySeries.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.policySeriesError = this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policySeries.errors);
    }

    checkPolicyNumberError() {
        this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(value => {
                this.policyNumberError = this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.errors;
                this.selectedPolicyValue = value;
            });
    }

    getPlaceOfStayError() {
        const cityErrorCode = this.cardThirteenYService.getControls(this.mainForm, 'generalInfo').placeOfStay.errors;
        return cityErrorCode.required ? 'Укажите место постоянного пребывания' : 'Укажите регион или город';
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

    setPolicyNumberError() {
        this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.setErrors({incorrect: true});
        this.policyNumberError = this.cardThirteenYService.getControls(this.mainForm, 'omsInfo').policyNumber.errors;
        this.cardThirteenYService.setActiveTabValid(this.mainForm.valid);
    }

    openDatepicker(name: string) {
        this[name].open();
    }
}
