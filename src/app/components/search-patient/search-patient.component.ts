import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as M from 'materialize-css/dist/js/materialize';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PatientSearchService} from '../../service/patient-search.service';
import {PatientSearch} from '../../interface/patient-search';
import {ValidationService} from '../../service/validation.service';
import {ValiedateSnils} from '../../validators/snils.validator';
import {PaginationInstance} from 'ngx-pagination';
import {regexMapVal} from '../../directive/validation.directive';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.sass']
})
export class SearchPatientComponent implements OnInit {
  @ViewChild('collapsible') elCollapsible: ElementRef;
  filterPatient: FormGroup;
  patientResult: PatientSearch[];
  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1
  };

  constructor(private fb: FormBuilder, private api: PatientSearchService) {
    this.initForm();
  }

  private initForm(): void {
    this.filterPatient = this.fb.group({
      surname: [null, Validators.pattern(regexMapVal.name)],
      name: [null, Validators.pattern(regexMapVal.name)],
      patronymic: [null],
      snilsNo: [null, ValiedateSnils],
      birthdateFrom: [null],
      birthdateTo: [null],
      idVmpSex: [null],
      ageGroup: [null],
      seria: [null],
      number: [null],
      privileges: [null],
      socialStatus: [null],
      profile: [null],
      speakers: [null],
      records: [null]
    });
  }

  isValid(name: string) {
    return ValidationService.checkValidation(name, this.filterPatient);
  }

  ngOnInit(): void {
    const instanceCollapsible = new M.Collapsible(this.elCollapsible.nativeElement, {});
  }

  searchPatient() {
    this.api.searchPatient('search').subscribe(
      (data) => {
        this.patientResult = data;
      }
    );
  }

  onChanged(event) {
    this.filterPatient.controls.birthdateFrom.setValue(event[0]);
    this.filterPatient.controls.birthdateTo.setValue(event[1]);
  }

  clearSearch() {
    this.filterPatient.reset();
  }


}
