import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import * as M from 'materialize-css/dist/js/materialize';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PatientSearchService} from '../../service/patient-search.service';
import {PatientSearchModel} from '../../models/patient-search.model';
import {ValidationService} from '../../service/validation.service';
import {ValiedateSnils} from '../../validators/snils.validator';
import {PaginationInstance} from 'ngx-pagination';
import {regexMapVal} from '../../directive/validation.directive';
import {Observable} from 'rxjs';
import {MaterializeAction} from '@samuelberthe/angular2-materialize';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ExportModalComponent} from '../export-modal/export-modal.component';

@Component({
    selector: 'app-search-patient',
    templateUrl: './search-patient.component.html',
    styleUrls: ['./search-patient.component.sass']
})
export class SearchPatientComponent implements OnInit {
    @ViewChild('collapsible') elCollapsible: ElementRef;
    filterPatient: FormGroup;
    patientResult$: Observable<PatientSearchModel[]>;
    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 10,
        currentPage: 1
    };
    actions1 = new EventEmitter<string | MaterializeAction>();

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private api: PatientSearchService) {
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
            seria_dul: [null],
            number_dul: [null],
            identifier: [null],
            records: [null]
        });
    }

    isValid(name: string) {
        return ValidationService.checkValidation(name, this.filterPatient);
    }

    ngOnInit(): void {
        const instanceCollapsible = new M.Collapsible(this.elCollapsible.nativeElement, {});
    }

    async searchPatient() {
        this.patientResult$ = this.api.searchPatient('search');
        this.actions1.emit({action: 'close', params: [0]});
    }


    onChanged(event) {
        this.filterPatient.controls.birthdateFrom.setValue(event[0]);
        this.filterPatient.controls.birthdateTo.setValue(event[1]);
    }

    clearSearch() {
        this.filterPatient.patchValue({
            surname: null,
            name: null,
            patronymic: null,
            snilsNo: null,
            birthdateFrom: null,
            birthdateTo: null,
            idVmpSex: 0,
            seria_dul: null,
            number_dul: null,
            identifier: null,
            records: 2
        });
    }

    openExport() {
        const dialogExport = new MatDialogConfig();
        dialogExport.width = '55%';
        dialogExport.maxHeight = '70%';
        this.dialog.open(ExportModalComponent, dialogExport);
    }

}
