import {Component, OnInit} from '@angular/core';
import {DictionaryService} from '../../../service/dictionary.service';
import {pickerI18n, TalonComponent} from '../talon.component';
import {FinancingSource, Lgota, Organ, SocialStatus, VmpStage0} from '../../../models/talon.model';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {InsuranceCompany} from '../../../models/dictionary.model';
import {debounceTime} from 'rxjs/operators';

declare var M: any;

@Component({
    selector: 'app-stage0',
    templateUrl: './stage0.component.html',
    styleUrls: ['./stage0.component.sass']
})
export class Stage0Component implements OnInit {

    pickerI18n = pickerI18n;
    vmpStage0: VmpStage0;
    financingSources: Observable<FinancingSource[]>;
    lgotas: Observable<Lgota[]>;
    socialStatuses: Observable<SocialStatus[]>;
    organs: Observable<Organ[]>;
    parent: TalonComponent;

    insuranceCompanySearch: FormControl = new FormControl();
    filteredInsuranceCompanies: InsuranceCompany[];

    constructor(public dictionaryService: DictionaryService, parent: TalonComponent) {
        this.parent = parent;
        this.financingSources = dictionaryService.getFinancingSources();
        this.lgotas = dictionaryService.getLgotas();
        this.socialStatuses = dictionaryService.getSocialStatuses();
        this.organs = dictionaryService.getOrgans();

        this.setStage();

        this.parent.onTalonChange.subscribe(talon => {
            console.log('talon changed');
            this.setStage();
            if (!parent.isEditable('talon.vmpStage0.insuranceCompany')) {
                this.insuranceCompanySearch.disable();
            }
        });
    }

    setStage() {
        if (this.parent.talon && this.parent.talon.vmpStage0) {
            this.vmpStage0 = this.parent.talon.vmpStage0;
        } else {
            this.vmpStage0 = new VmpStage0();
        }
        console.log('vmpStage0', this.vmpStage0);
    }

    ngOnInit() {
        this.insuranceCompanySearch.valueChanges.pipe(
            debounceTime(300)
        ).subscribe(value => {
            if (value !== '') {
                this.findInsuranceCompany(value);
            }
        });
    }

    onSubmit() {
        console.log('Submitting talon', this.parent.talon);
        this.parent.saveTalon();
    }

    compareId(obj1: any, obj2: any): boolean {
        return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
    }

    setInsuranceCompany(insuranceCompany?: InsuranceCompany) {
        console.log('set insurance company to', insuranceCompany);
        this.vmpStage0.insuranceCompany = insuranceCompany;
    }

    findInsuranceCompany(query: string) {
        this.dictionaryService.getInsuranceCompanies(query).subscribe(response => {
            this.filteredInsuranceCompanies = response;
        });
    }

}
