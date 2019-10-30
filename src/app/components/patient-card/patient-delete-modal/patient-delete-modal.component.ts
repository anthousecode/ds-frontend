import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-patient-delete-modal',
  templateUrl: './patient-delete-modal.component.html',
  styleUrls: ['./patient-delete-modal.component.sass']
})
export class PatientDeleteModalComponent implements OnInit {

  constructor(
      private matDialogRef: MatDialogRef<PatientDeleteModalComponent>,
      @Inject(MAT_DIALOG_DATA) private data: number,
  ) { }

  ngOnInit() {
  }
}
