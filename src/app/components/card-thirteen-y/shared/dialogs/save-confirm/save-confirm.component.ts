import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import {CardThirteenYService} from '../../../card-thirteen-y.service';

@Component({
  selector: 'app-save-confirm',
  templateUrl: './save-confirm.component.html',
  styleUrls: ['./save-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveConfirmComponent {

  constructor(private cardThirteenYService: CardThirteenYService,
              private snackBar: MatSnackBar,
              private cardService: CardThirteenYService,
              @Inject(MAT_DIALOG_DATA) private data: any) {

  }
}
