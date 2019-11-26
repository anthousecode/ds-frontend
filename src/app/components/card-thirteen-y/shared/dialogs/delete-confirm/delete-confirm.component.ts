import {Component, ChangeDetectionStrategy} from '@angular/core';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import {MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteConfirmComponent {

  constructor(private cardThirteenYService: CardThirteenYService,
              private dialogRef: MatDialogRef<DeleteConfirmComponent>,
              private snackBar: MatSnackBar) {
  }

  deleteData() {
    this.dialogRef.close();
    this.snackBar.open('Диагноз удалён', 'ОК', {
      duration: 5000
    });
  }
}
