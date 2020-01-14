import {Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef} from '@angular/core';
import {CardThirteenYService} from '../../../card-thirteen-y.service';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';

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
        this.data.arr.splice(this.data.i, 1);
        this.dialogRef.close();
        this.snackBar.open(this.data.message, 'ОК', {
            duration: 5000
        });
    }
}
