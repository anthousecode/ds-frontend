import {Component, ChangeDetectionStrategy} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {CardThirteenYService} from '../../../card-thirteen-y.service';

@Component({
  selector: 'app-save-confirm',
  templateUrl: './save-confirm.component.html',
  styleUrls: ['./save-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveConfirmComponent {

  constructor(private cardThirteenYService: CardThirteenYService,
              private snackBar: MatSnackBar) {

  }

  saveData() {
    this.snackBar.open('Сохранено', 'ОК', {
      duration: 5000
    });
  }
}
