import { Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PatientSearchService} from '../../service/patient-search.service';
import {ValidationService} from '../../service/validation.service';
import {ValiedateSnils} from '../../validators/snils.validator';
import {PaginationInstance} from 'ngx-pagination';
import {regexMapVal} from '../../directive/validation.directive';
import {Observable} from 'rxjs';
import {MaterializeAction} from '@samuelberthe/angular2-materialize';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {ExportModalComponent} from '../export-modal/export-modal.component';
import {Patient} from '../../models/patient.model';

@Component({
    selector: 'app-search-patient',
    templateUrl: './search-patient.component.html',
    styleUrls: ['./search-patient.component.sass']
})
export class SearchPatientComponent implements OnInit {
    @ViewChild('collapsible') elCollapsible: ElementRef;
    filterPatient: FormGroup;
    patientResult$: Observable<Patient[]>;
    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 10,
        currentPage: 1
    };
    actions1 = new EventEmitter<string | MaterializeAction>();

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private api: PatientSearchService,
        @Inject('M') private M: any,
    ) {
        this.initForm();
    }

    private initForm(): void {
        this.filterPatient = this.fb.group({
            lastName: [null, Validators.pattern(regexMapVal.name)],
            firstName: [null, Validators.pattern(regexMapVal.name)],
            patronymic: [null],
            snils: [null, ValiedateSnils],
            birthdate_from: [null],
            birthdate_to: [null],
            sex: [null],
            seria_dul: [null],
            number_dul: [null],
            unqId: [null],
            pagesize: [null],
            page: [0]
        });
    }

    isValid(name: string) {
        return ValidationService.checkValidation(name, this.filterPatient);
    }

    ngOnInit(): void {
        const instanceCollapsible = new this.M.Collapsible(this.elCollapsible.nativeElement, {});
    }

    async searchPatient() {
        this.patientResult$ = this.api.searchPatient$(this.filterPatient.value);
        this.actions1.emit({action: 'close', params: [0]});
    }


    onChanged(event) {
        this.filterPatient.controls.birthdate_from.setValue(event[0]);
        this.filterPatient.controls.birthdate_to.setValue(event[1]);
    }

    clearSearch() {
        this.filterPatient.patchValue({
            lastName: null,
            firstName: null,
            patronymic: null,
            snils: null,
            birthdate_from: null,
            birthdate_to: null,
            sex: 0,
            seria_dul: null,
            number_dul: null,
            unqId: null,
            pagesize: 2
        });
    }

    openExport() {
        const dialogExport = new MatDialogConfig();
        dialogExport.width = '55%';
        dialogExport.maxHeight = '70%';
        this.dialog.open(ExportModalComponent, dialogExport);
    }

}
