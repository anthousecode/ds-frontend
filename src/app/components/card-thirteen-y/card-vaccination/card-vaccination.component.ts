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

  @ViewChild('vaccinationInput') vaccinationInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutoComplete: MatAutocomplete;

  constructor(private fb: FormBuilder,
              private cardThirteenYService: CardThirteenYService,
              private dictionaryService: DictionaryService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.createVaccinationForm();
    this.initStateVaccinations();
    this.initVaccinations();
    this.filterVaccinations();
    // this.cardThirteenYService.setTabInitValues(this.vaccinationForm.value);
    // this.cardThirteenYService.setTabCurrentValues(null);
    // this.checkFormChanges();
  }

  createVaccinationForm() {
    this.vaccinationForm = this.fb.group({
      state: [''],
      vaccination: ['']
    });
  }

  checkFormChanges() {
    this.vaccinationForm.valueChanges
      .pipe(debounceTime(800))
      .subscribe(data => this.cardThirteenYService.setTabCurrentValues(data));
  }

  private initStateVaccinations() {
    this.dictionaryService.getVaccinationStatuses()
      .subscribe((vaccinations: []) => {
        this.stateVaccination = vaccinations;
        this.cdr.markForCheck();
      });
  }

  private initVaccinations() {
    this.dictionaryService.getVaccines()
      .subscribe((vaccinations) => {
        for (const vaccine of vaccinations) {
          this.vaccinations.push(vaccine.name);
        }
        this.cdr.markForCheck();
      });
  }

  private filterVaccinations() {
    this.filteredVaccinations$ = this.vaccinationForm.get('vaccination')
      .valueChanges
      .pipe(
        debounceTime(300),
        startWith(null),
        map((vaccination: string | null) => {
          return vaccination ? this._filter(vaccination).sort() : this.vaccinations.slice();
        }));
  }

  removeChipsVaccination(vaccination: string): void {
    this.chipsVaccinations = this.chipsVaccinations.filter((item) => item !== vaccination);
    this.cdr.detectChanges();
    this.vaccinations = this.vaccinations.concat([vaccination]);
  }

  addChipsVaccination(event: MatAutocompleteSelectedEvent): void {
    this.chipsVaccinations.push(event.option.viewValue);
    this.vaccinations = this.vaccinations.filter((item) => item !== event.option.viewValue);
    this.cdr.detectChanges();
    this.vaccinationInput.nativeElement.value = '';
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.vaccinations.filter(vaccine => vaccine.toLowerCase().indexOf(filterValue) === 0);
  }

  onSubmit(value) {
    console.log(value);
  }
}
