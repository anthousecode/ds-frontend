import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HttpParams } from '@angular/common/http';
import { PatientSearchService } from '../../service/patient-search.service';
import { finalize } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/typings/select';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.sass']
})
export class ExportModalComponent implements OnInit {
  loading = false;
  format = 'xls';
  serverErrors: string = null;

  constructor(
      private matDialogRef: MatDialogRef<ExportModalComponent>,
      @Inject(MAT_DIALOG_DATA) private data: HttpParams,
      private patientSearchService: PatientSearchService,
  ) {}

  ngOnInit() {

  }

  formatChange(format: MatSelectChange) {
    this.format = format.value;
  }

  export() {
    this.loading = true;
    this.serverErrors = null;
    this.patientSearchService.getExport(this.data, this.format)
        .pipe(finalize(() => this.loading = false))
        .subscribe(() => {
          this.matDialogRef.close();
        }, error => this.getErrorMessage(error));
  }

  getErrorMessage(error) {
    if (error.error instanceof ErrorEvent) {
      this.serverErrors = `Error: ${error.error.message}`;
    } else {
      this.serverErrors = `Error Code: ${error.status}\nMessage: ${error.status}`;
    }
  }

}
