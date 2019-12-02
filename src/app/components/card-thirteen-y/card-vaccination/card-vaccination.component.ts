import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {CardThirteenYService} from '../card-thirteen-y.service';
import {DictionaryService} from '../../../service/dictionary.service';
import {VaccinationStatus} from '../../../models/dictionary.model';

@Component({
    selector: 'app-card-vaccination',
    templateUrl: './card-vaccination.component.html',
    styleUrls: ['./card-vaccination.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardVaccinationComponent implements OnInit {

    private vaccinationForm: FormGroup;
    private stateVaccination: VaccinationStatus[];
    private separatorKeysCodes: number[] = [ENTER];
    private filteredVaccinations$: Observable<any[]>;
    private chipsVaccinations: string[] = [];
    private vaccinations: string[] = [];
    chipsQuery!: any;
    formValues!: any;

    @ViewChild('vaccinationInput') vaccinationInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutoComplete: MatAutocomplete;

    constructor(private fb: FormBuilder,
                private cardThirteenYService: CardThirteenYService,
                private dictionaryService: DictionaryService,
                private cdRef: ChangeDetectorRef) {
        this.cardThirteenYService.activeTabCurrentValues
            .subscribe(data => {
                this.formValues = data;
            });
        this.cardThirteenYService.setActiveTabValid(true);
    }

    ngOnInit() {
        this.createVaccinationForm();
        this.initStateVaccinations();
        // this.getInitValues();
        this.initVaccinations();
        this.filterVaccinations();
        this.cardThirteenYService.setSelectedTabCurrentValues(null);

        this.checkFormChanges();
    }

    createVaccinationForm() {
        this.vaccinationForm = this.fb.group({
            state: [''],
            vaccination: ['']
        });
    }

    getInitValues() {
        this.cardThirteenYService.activeTabInitValues.subscribe(data => {
            this.formValues = data;
            this.setFormInitValues(data);
            this.cardThirteenYService.setSelectedTabInitValues(this.vaccinationForm.value);
        });
    }

    setFormInitValues(data) {
        if (data.vaccination) {
            if (data.vaccination.status) {
                this.vaccinationForm.controls.state.setValue(data.status.id, {emitEvent: false});
                // this.vaccinationForm.controls.state.setValue(data.status.id, {emitEvent: false});
            }
        }
        // const initVaccinations = ['БЦЖ - R1', 'БЦЖ - R2'];
        // this.chipsVaccinations = initVaccinations;
        // this.vaccinations = this.vaccinations.filter(item => !initVaccinations.includes(item));
        // this.cdRef.markForCheck();
        // console.log(this.vaccinations)
    }

    checkFormChanges() {
        this.vaccinationForm.valueChanges
            .pipe(debounceTime(500))
            .subscribe(data => {
                console.log(this.chipsVaccinations);
                const chipsArr = this.chipsQuery.filter(item => this.chipsVaccinations.includes(item.name));
                this.cardThirteenYService.setSelectedTabCurrentValues(data);
                const vaccinationData = {
                    ...this.formValues,
                    vaccination: {
                        status: {
                            id: data.state
                        },
                        vaccines: chipsArr
                    }
                };
                this.cardThirteenYService.setTabCurrentValues(vaccinationData);
            });
    }

    private initStateVaccinations() {
        this.dictionaryService.getVaccinationStatuses().subscribe((vaccinations: []) => {
                this.stateVaccination = vaccinations;
                this.cdRef.markForCheck();
            });
    }

    private initVaccinations() {
        this.dictionaryService.getVaccines().subscribe((vaccinations) => {
            this.chipsQuery = vaccinations;
            for (const vaccine of vaccinations) {
                this.vaccinations.push(vaccine.name);
            }
            this.getInitValues();
            this.cdRef.markForCheck();
        });
    }

    private filterVaccinations() {
        this.filteredVaccinations$ = this.vaccinationForm.get('vaccination').valueChanges
            .pipe(
                debounceTime(300),
                startWith(null),
                map((vaccination: string | null) => vaccination ? this._filter(vaccination).sort() : this.vaccinations.slice()));
    }

    removeChipsVaccination(vaccination: string) {
        this.chipsVaccinations = this.chipsVaccinations.filter((item) => item !== vaccination);
        this.vaccinationForm.controls.state.setValue(this.vaccinationForm.controls.state.value);
        this.cdRef.detectChanges();
        this.vaccinations = this.vaccinations.concat([vaccination]);
    }

    addChipsVaccination(event: MatAutocompleteSelectedEvent) {
        this.chipsVaccinations.push(event.option.viewValue);
        this.vaccinations = this.vaccinations.filter((item) => item !== event.option.viewValue);
        this.cdRef.detectChanges();
        this.vaccinationInput.nativeElement.value = '';
    }

    private _filter(value: string): any[] {
        const filterValue = value.toLowerCase();
        return this.vaccinations.filter(vaccine => vaccine.toLowerCase().indexOf(filterValue) === 0);
    }
}
