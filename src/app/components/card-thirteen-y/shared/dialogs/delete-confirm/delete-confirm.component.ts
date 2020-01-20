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
              @Inject(MAT_DIALOG_DATA) public data: any,
              private cdRef: ChangeDetectorRef
  ) {
  }

  deleteData() {
    if (this.data.additionalExaminations) {
      this.data.additionalExaminations.splice(this.data.i, 1);
      this.data.formValues.additionalExaminations = this.data.additionalExaminations;
      this.cardThirteenYService.setTabCurrentValues(this.data.formValues);
      this.dialogRef.close();
    }

    if (this.data.arr) {
      this.data.arr.splice(this.data.i, 1);
      console.log('this.data.arr', this.data.arr);
      this.dialogRef.close({data: this.data.arr});
    }
    this.snackBar.open('Исследование удалено', 'ОК', {
      duration: 5000
    });
  }

  getDeleteKey() {
    return this.data.key === 'research' ? 'исследование' : 'диагноз';
  }

  getDeleteConfirmMessage() {
    return this.data.key === 'research' ? 'Исследование удалено' : 'Диагноз удалён';
  }
}
