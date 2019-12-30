import { Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from '@angular/core';
import { CardThirteenYService } from '../../../card-thirteen-y.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmComponent {

  constructor(private cardThirteenYService: CardThirteenYService,
              private dialogRef: MatDialogRef<DeleteConfirmComponent>,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public additionalExaminationsData: any,
              private cdRef: ChangeDetectorRef
  ) {
  }

  deleteData() {
    this.additionalExaminationsData.additionalExaminations.splice(this.additionalExaminationsData.i, 1);
    this.additionalExaminationsData.formValues.additionalExaminations = this.additionalExaminationsData.additionalExaminations;
    this.cardThirteenYService.setTabCurrentValues(this.additionalExaminationsData.formValues);
    this.additionalExaminationsData.cdRef.detectChanges();
    this.dialogRef.close();
    this.snackBar.open(this.getDeleteConfirmMessage(), 'ОК', {
      duration: 5000
    });
  }

  getDeleteKey() {
    return this.additionalExaminationsData.key === 'research' ? 'исследование' : 'диагноз';
  }

  getDeleteConfirmMessage() {
    return this.additionalExaminationsData.key === 'research' ? 'Исследование удалено' : 'Диагноз удалён';
  }
}
