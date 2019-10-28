import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild } from '@angular/core';
import { Sex } from '../../models/dictionary.model';
import { DictionaryService } from '../../service/dictionary.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { regexMapVal } from '../../directive/validation.directive';
import { ValidationService } from '../../service/validation.service';
import { MaterializeAction } from '@samuelberthe/angular2-materialize';
import { PatientSearchResult } from '../../models/patient.model';
import { PatientService } from '../../service/patient.service';
import { HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { PaginationInstance } from 'ngx-pagination';
import { DatePickerRangeComponent } from '../date-picker-range/date-picker-range.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ExportModalComponent } from '../export-modal/export-modal.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-search-child',
    templateUrl: './search-child.component.html',
    styleUrls: ['./search-child.component.scss']
})
export class SearchChildComponent implements OnInit, AfterViewInit {

    sexes: Sex[] = this.apiDictionary.getSexes();
    collapsibleClose = new EventEmitter<string | MaterializeAction>();
    patientForm: FormGroup;
    patientResult: PatientSearchResult;
    pagesize = 30;
    loading = false;
    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 30,
        currentPage: 1
    };

    @ViewChild(DatePickerRangeComponent) child: DatePickerRangeComponent;
    @ViewChild('floating') floating: ElementRef;

    constructor(
        private apiDictionary: DictionaryService,
        private fb: FormBuilder,
        private patientService: PatientService,
        @Inject('M') private M: any,
        private dialog: MatDialog,
    ) {
    }

    ngOnInit() {
        this.initForm();
    }

    ngAfterViewInit() {
        const instanceFloating = new this.M.FloatingActionButton(this.floating.nativeElement, {
            direction: 'left',
            hoverEnabled: false
        });
    }

    openExport() {
        const dialogExport = new MatDialogConfig();
        dialogExport.width = '55%';
        dialogExport.maxHeight = '70%';
        this.dialog.open(ExportModalComponent, dialogExport);
    }

    initForm() {
        this.patientForm = this.fb.group({
            unqId: [null],
            firstName: [null, [Validators.maxLength(50), Validators.pattern(regexMapVal.name)]],
            lastName: [null, [Validators.maxLength(50), Validators.pattern(regexMapVal.name)]],
            patronymic: [null, [Validators.maxLength(50), Validators.pattern(regexMapVal.name)]],
            sex: [null],
            birthdate_from: [null, {updateOn: 'blur'}],
            birthdate_to: [null, {updateOn: 'blur'}],
            snils: [null],
            documSerial: [null, Validators.maxLength(50)],
            documNumber: [null, Validators.maxLength(50)],
            sexs: [null],
        });
    }

    isValid(name: string) {
        return ValidationService.checkValidation(name, this.patientForm);
    }

    onChanged(event) {
        this.patientForm.controls.birthdate_from.setValue(event[0]);
        this.patientForm.controls.birthdate_to.setValue(event[1]);
    }

    async searchPatient(page?: number) {
        this.collapsibleClose.emit({action: 'close', params: [0]});

        let params: HttpParams = new HttpParams();
        if (this.patientForm.value) {
            params = this.getParamsFromValue({ ...this.patientForm.value, page}, params);
        }
        this.loading = true;
        this.patientService.searchPatient$(params)
            .pipe(finalize(() => this.loading = false))
            .subscribe(result => {
            this.paginationConfigChange(page, result.count);
            this.patientResult = result;
            this.patientResult.patients = Object.values(this.patientResult.patients);
        });
    }

    getParamsFromValue(values, params: HttpParams) {
        for (const key of Object.keys(values)) {
            if (values[key]) {
                if (key.startsWith('birthdate')) { values[key] = moment(values[key], 'DD-MM-YYYY').format('YYYY-MM-DD'); }
                params = params.set(key, values[key]);
            }
        }
        params = params.set('pagesize', this.pagesize + '');
        return params;
    }

    clearForm() {
        this.patientForm.reset();
        this.child.clearDateRange();
    }

    paginationConfigChange(page: number, totalItems: number) {
        this.config.currentPage = page || 1;
        this.config.totalItems = totalItems;
        this.config.itemsPerPage = this.pagesize;
    }

}
